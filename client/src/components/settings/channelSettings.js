
const ChannelSettings = (props) => {


    return(
        <div className="channelOptions">
            <div className="channelOptionHeader">
                <p>{props.activeChannel.channelName}</p>
                    {props.mainChannel !== props.activeChannel.channelName && <button onClick={props.changeMainChannel}>Set this channel as main channel</button>}
                    <div className="channelPrivacyOptions">
                        <div>
                            <input
                                type="checkbox"
                                checked={props.activeChannel.acces === "private"}
                                onChange={() => {props.changeChannelPrivacySettings("acces")}}/>
                            <p>Private</p>
                        </div>
                        <div>
                            <input 
                                type={"checkbox"}
                                checked={props.activeChannel.messageAcces === "public"}
                                onChange={() => {props.changeChannelPrivacySettings("messageAcces")}}/>
                            <p>Anyone can send messages</p>
                        </div>
                    </div>
                </div>   
            </div>
    )
}

export default ChannelSettings;