import React, { useState, useEffect } from "react";
import { Table, Input } from "antd";
import axios from "axios";

dotenv.config();

const { Search } = Input;
const TaskTable = ({ gotoTask, project }) => {

  const location = `${process.env.REACT_APP_API_HOST}`;
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchTasks = async () => {
    try {
      const response = await axios(`${location}/api/v1/userTasks?`, {
        method: "GET",
        params: {
          project: project.name,
          ordering: "-id",
          // page_size: project.num_tasks,
          page_size: 10
        },
        withCredentials: true,
      });
      setTasks(
        response.data.results.map((task) => ({
          key: task.id,
          project: task.project,
          name: task.name,
          status: task.status,
          progress: `${task.statistics[0].progress_count} / ${task.statistics[0].total_count}`,
        }))
      );
    } catch (err) {
       console.log(err)
    }
    setLoading(false);
  };
  const handleSearch = (value) => {
    gotoTask(value)
  }
  useEffect(() => {
    setLoading(true);
    fetchTasks();
  }, [project]);
  const columns = [
    {
      title: "ID",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Project",
      dataIndex: "project",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Progress",
      dataIndex: "progress",
      key: "progress",
    },
  ];
  return (
    <div>
      <div style={{marginBottom: '10px'}}>
      <Search allowClear onSearch={handleSearch} enterButton style={{width: '20%'}} placeholder={"Task ID"}/>
      </div>
        <Table
        style={{backgroundColor: '#ffffff', borderRadius: '5px'}}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                gotoTask(record.key);
              }, // click row
              // onDoubleClick: event => {}, // double click row
              // onContextMenu: event => {}, // right button click row
              // onMouseEnter: event => {}, // mouse enter row
              // onMouseLeave: event => {}, // mouse leave row
            };
          }}
          columns={columns}
          dataSource={loading ? null : tasks}
          pagination={false}
        ></Table>
    </div>
  );
};

export default TaskTable;
