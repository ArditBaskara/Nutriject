import './ProgressBar.css'

export default function ProgressBar({min, max, val, label, color='blue'}){
    const maxVal = max;
    const minVal = min;

    const percentMin = (minVal/maxVal) * 100;
    const percentCal = (val/maxVal) * 100;

    return (
        <div className='container' >
            <h1>{label}</h1>
            <div className="main-bar">
            <span className='tooltip-max'>
                Current {label} : {val}<br/>
                Min {label} : {minVal.toFixed(2)}<br/>
                Max {label} : {maxVal.toFixed(2)}
            </span>
                <div className='content' style={{width:percentCal+'%'}}>
    
                    {percentCal < 10 ? "." : <p>{percentCal}%</p>}
                </div>
                <div className='min-progress' style={{left:percentMin+'%', backgroundColor:color}}>
                    
                </div>
            </div>
        </div>
    )
}