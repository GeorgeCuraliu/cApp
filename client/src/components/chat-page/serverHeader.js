

const ServerHeader = (props) => {
return(
    <header className="serverHeader">
        <div className="serverImage"></div>
        <p className="serverName">{props.name}</p>
    </header>
)
}

export default ServerHeader