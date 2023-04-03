
export const Zoom = ({ data }) => {
    return (
        <div>
            <div className="navbar-brand fs-3 text-center">{data.x} has {data.y} Hours</div>
            <p className="text-justify text-center">{data.description}</p>
        </div>
    );
}