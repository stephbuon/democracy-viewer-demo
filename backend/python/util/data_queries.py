from pandas import DataFrame, concat, merge
from sqlalchemy import Engine
from time import time
from util.s3 import download
import util.sql_queries as sql

# Retrieve data from s3 and keep required data
def get_text(engine: Engine, table_name: str, token: str | None = None) -> DataFrame:
    start = time()
    
    # Get all text columns
    text_cols = sql.get_text_cols(engine, table_name)
    
    # Download raw data from s3
    df_raw = download("datasets", table_name, token)
    # Reformat data to prep for preprocessing
    df = []
    for col in text_cols:
        df.append(DataFrame({
            "id": df_raw.index,
            "text": df_raw[col],
            "col": col
        }))
    df = concat(df)
    
    print("Loading data: {} seconds".format(time() - start))
    
    return df

# Get the values of a subset of columns for each record
def get_columns(table_name: str, columns: list[str], token: str | None = None):
    df = download("datasets", table_name, token)
    
    return df[columns]

# Select records by group and word lists
def basic_selection(table_name: str, column: str | None, values: list[str], word_list: list[str], pos_list: list[str] = [], token: str | None = None) -> DataFrame:
    # Download raw and tokenized data
    df_raw = download("datasets", table_name, token)
    df_split = download("tokens", table_name, token)
    df_tokens = df_split.copy()
    
    # Subset of columns to keep at the end
    cols = ["record_id", "word", "count"]
    
    # If grouping values are defined, filter by them
    if column is not None and column != "":
        df_raw.rename({ column: "group" }, axis = 1, inplace = True)
        cols.append("group")
        if len(values) > 0:
            df_raw = df_raw[df_raw["group"].isin(values)]
            
    # If a word list is defined, filter by it
    if len(word_list) > 0:
        df_split = df_split[df_split["word"].isin(word_list)]        
    
    # Filter words by POS if list given
    if len(pos_list) > 0:
        df_split = df_split[df_split["pos"].isin(pos_list)]
        # Collocates
        if "adj-noun" in pos_list:
            pairs = adj_noun_pairs(df_tokens, word_list)
            df_split = concat([df_split, pairs])
        if "subj-verb" in pos_list:
            pairs = subj_verb_pairs(df_tokens, word_list)
            df_split = concat([df_split, pairs])
     
    # Sort by the word   
    df_split.sort_values("word", inplace = True)
    
    # Merge datasets
    df = merge(df_raw, df_split, left_index = True, right_on = "record_id").reset_index()
    
    # Return df with subset of columns
    return df[cols]

# POS collocates
### Adjective/Noun
def adj_noun_pairs(tokens: DataFrame, word_list: list[str]):
    nouns = tokens[tokens["pos"] == "noun"]
    adjs = tokens[tokens["pos"] == "adj"]
        
    pairs = merge(adjs, nouns, left_on = ["record_id", "col", "head"], right_on = ["record_id", "col", "word"])
    if len(word_list) > 0:
        pairs = pairs[(pairs["word_x"].isin(word_list) | (pairs["word_y"].isin(word_list)))]
    if len(pairs) == 0:
        return DataFrame()
        
    pairs["count"] = pairs[["count_x", "count_y"]].min(axis=1)
    pairs["word"] = pairs[["word_x", "word_y"]].agg(" ".join, axis = 1)
    pairs = pairs.drop([ col for col in pairs.columns if "_" in col and col != "record_id" ], axis = 1)
    
    return pairs
       
### Subject/Verb
def subj_verb_pairs(tokens: DataFrame, word_list: list[str]):
    subjects = tokens[tokens["dep"].isin(["nsubj", "nsubjpass"])]
    verbs = tokens[tokens["pos"] == "verb"]
    
    if len(word_list) > 0:
        subjects = subjects[subjects["word"].isin(word_list)]
        verbs = verbs[verbs["word"].isin(word_list)]
        
    verb_first = merge(verbs, subjects, left_on = ["record_id", "col", "head"], right_on = ["record_id", "col", "word"])
    verb_second = merge(verbs, subjects, left_on = ["record_id", "col", "word"], right_on = ["record_id", "col", "head"])
    pairs = concat([verb_first, verb_second])
    if len(word_list) > 0:
        pairs = pairs[(pairs["word_x"].isin(word_list) | (pairs["word_y"].isin(word_list)))]
    if len(pairs) == 0:
        return DataFrame()
    
    pairs["count"] = pairs[["count_x", "count_y"]].min(axis=1)
    pairs["word"] = pairs[["word_y", "word_x"]].agg(" ".join, axis = 1)
    pairs = pairs.drop([ col for col in pairs.columns if "_" in col and col != "record_id" ], axis = 1)
    
    return pairs

# Get number of group values that include words
def group_count_by_words(table_name: str, word_list: list[str], column: str | None, values: list[str], token: str | None = None) -> dict[str, int]:
    # Download raw and tokenized data
    df_raw = download("datasets", table_name, token)
    df_split = download("tokens", table_name, token)
    
    # Filter by word list
    if len(word_list) > 0:
        df_split = df_split[df_split["word"].isin(word_list)]
    
    # Merge datasets
    df = merge(df_raw, df_split, left_index = True, right_on = "record_id")
    
    # Get record/group count for each word
    records = {}
    for word in df["word"].unique():
        if column is None or column == "":
            records[word] = len(df[df["word"] == word])
        elif len(values) > 0:
            records[word] = len(df[(df["word"] == word) & (df[column].isin(values))][column].unique())
        else:
            records[word] = len(df[df["word"] == word][column].unique())
        
    return records

# Get number of group values that include POS
def group_count_by_pos(table_name: str, pos_list: list[str], column: str | None, token: str | None = None) -> dict[str, int]:
    # Download raw and tokenized data
    df_raw = download("datasets", table_name, token)
    df_split = download("tokens", table_name, token)
    
    # Filter by word list
    if len(pos_list) > 0:
        df_split = df_split[df_split["pos"].isin(pos_list)]
    
    # Merge datasets
    df = merge(df_raw, df_split, left_index = True, right_on = "record_id")
    
    # Get record/group count for each word
    records = {}
    for pos in df["pos"].unique():
        if column is None or column == "":
            records[pos] = len(df[df["pos"] == pos])
        else:
            records[pos] = len(df[df["pos"] == pos][column].unique())
        
    return records

# Get the total number of distinct group values
def group_count(table_name: str, column: str, token: str | None = None) -> int:
    # Download raw data
    df_raw = download("datasets", table_name, token)
    
    # Get distinct values in column
    df_col = df_raw[column].unique()
        
    return len(df_col)

# Get the total number of records
def record_count(table_name: str, token: str | None = None) -> int:
    df = download("datasets", table_name, token)
        
    return len(df)

# Get the total word count in a corpus
def total_word_count(table_name: str, token: str | None = None) -> int:
    # Download tokenized data
    df_split = download("tokens", table_name, token)
    
    # Return sum of count column
    return df_split["count"].sum()

# Get the count of the given words in a corpus
def word_counts(table_name: str, word_list: list[str], token: str | None = None) -> dict[str, int]:
    # Download tokenized data
    df_split = download("tokens", table_name, token)
    
    # Sum the counts for each word in word_list
    records = {}
    for word in word_list:
        records[word] = df_split[df_split["word"] == word]["count"].sum()
        
    return records

# Get the word count of group values
def group_counts(table_name: str, column: str, values: list[str], token: str | None = None) -> dict[str, int]:
    # Download raw and tokenized data
    df_raw = download("datasets", table_name, token)
    df_split = download("tokens", table_name, token)
    
    # Filter raw data for column values
    if len(values) > 0:
        df_raw = df_raw[df_raw[column].isin(values)]
    
    # Merge datasets
    df = merge(df_raw, df_split, left_index = True, right_on = "record_id")
        
    records = {}
    for value in values:
        records[value] = df[df[column] == value]["count"].sum()
        
    return records