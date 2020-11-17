import React, { useState, useEffect } from 'react'
import TaskCards from './TaskStatCards'
import TaskTable from './TaskTable'
import './statistics.css'

const TaskStats = ({project}) => {
    const [taskID, setTaskID] = useState(0)

    useEffect(() => {
        setTaskID(0);
    },[project])

    return(
        <div className="TaskStatContainer">
            <div className={`statlist ${!taskID ? 'active' : '' }`} >
                <TaskTable project={project} gotoTask={(id)=>setTaskID(id)}/>
            </div>
            <div className={`statCards ${taskID ? 'active' : ''}`} >
                <TaskCards taskID={taskID} back={()=>setTaskID(0)}/>
            </div>
        </div>
    )
}
export default TaskStats;