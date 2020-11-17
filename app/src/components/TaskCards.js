import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Icon,
  message,
  Button,
  Spin,
  Empty,
  Tooltip,
} from "antd";
import dotenv from "dotenv";
import { Bar, Doughnut, Polar, Line } from "react-chartjs-2";

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

dotenv.config();

const TaskCards = ({ taskID, back }) => {
  const location = `${process.env.REACT_APP_API_HOST}`;
  const [loading, setLoading] = useState(true);
  const [empty, setEmpty] = useState(true);
  const [taskData, setTaskData] = useState({
    project: "",
    task_name: "",
    frames_total: 0,
    frames_completed: 0,
    label_count: 0,
  });
  const [labelData, setLabelData] = useState({
    mistagged: 0,
    untagged: 0,
    overtagged: 0,
    tagging_range_error: 0,
    double_tagged: 0,
  });

  const doughnutData = {
    labels: ["Completed Frames", "Incomplete Frames"],
    datasets: [
      {
        backgroundColor: ["rgb(255,197,61)", "rgb(240,240,240,0.4)"],
        borderColor: ["rgb(250,173,20)", "rgb(240,240,240)"],

        hoverBackgroundColor: ["rgb(255,197,61,0.8)", "#f5f5f5"],
        data: [
          taskData.frames_total - taskData.frames_completed,
          taskData.frames_completed,
        ],
      },
    ],
  };

  const barData = {
    labels: [...Object.keys(labelData)],
    datasets: [
      {
        label: "Label Data",
        data: [...Object.values(labelData)],
        borderColor: [
          "rgb(230,52,98,1)",
          "rgb(254,95,85,1)",
          "rgb(255,255,86,1)",
          "rgb(104,166,145,1)",
          "rgb(142,237,247,1)",
        ],
        backgroundColor: [
          "rgb(230,52,98,0.2)",
          "rgb(254,95,85,0.2)",
          "rgb(255,255,86,0.2)",
          "rgb(104,166,145,0.2)",
          "rgb(142,237,247,0.2)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const fetchTaskStats = async () => {
    try {
      const response = await axios(`${location}/api/v1/statistics/task_stats`, {
        method: "GET",
        params: {
          taskId: taskID,
        },
        credentials: "include",
        withCredentials: true,
      });
      if (response.data.stats) {
        const dataset = response.data.stats;
        setEmpty(false);
        setTaskData({
          project: dataset.project,
          task_name: dataset.task_name,
          frames_total: dataset.frames_total,
          frames_completed: dataset.frames_completed,
          label_count: dataset.label_count,
        });
        setLabelData({
          ...dataset.reviews,
        });
      } else {
        setEmpty(true);
      }
    } catch (err) {
      setEmpty(true);
      message.error(err);
    }
    setLoading(false);
  };
  useEffect(() => {
    if (!taskID) {
      return;
    }
    fetchTaskStats();
  }, [taskID]);

  return (
    <>
      <Button type="link" onClick={back}>
        <Icon type="left" /> Back
      </Button>
      <Spin spinning={loading}>
        {empty ? (
          <div
            style={{
              width: "100%",
              borderRadius: "5px",
              backgroundColor: "#fafafa",
              height: "500px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Task ID not found"
            />
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              width: "100%",
              height: "500px",
            }}
          >
            <div
              // COLUMN 1
              style={{ flex: 1, display: "flex", flexWrap: "wrap", height: '100%' }}
            >
              <div
                className="cardContainer"
                style={{
                  textAlign: 'center',
                  width: "100%",
                  height: "14%",
                  overflow: "hidden",
                  border: '3px solid rgb(240,240,240,0.7)'
                }}
              >
                {"Project Name"}
                <Tooltip title={taskData.project}>
                  <h2>
                    {taskData.project.length > 10
                      ? taskData.project.slice(0, 10).concat("...")
                      : taskData.project}
                  </h2>
                </Tooltip>
              </div>
              <div
                className="cardContainer"
                style={{
                  textAlign: 'center',
                  width: "100%",
                  height: "30%",
                  overflow: "hidden",
                  border: '3px solid rgb(240,240,240,0.7)',
                  fontSize: '1.5em'
                }}
              >
                {"Task Name"}
                <div style={{ paddingTop: '25px' }}>
                <Tooltip title={taskData.task_name}>
                  <h2 style={{color: 'rgb(24,144,255,0.9)'}} >
                    {taskData.task_name.length > 10
                      ? taskData.task_name.slice(0, 10).concat("...")
                      : taskData.task_name}
                  </h2>
                </Tooltip>
                </div>
              </div>
              <div
                className="cardContainer"
                style={{
                  textAlign: "center",
                  width: "100%",
                  height: "25%",
                }}
              >
                <div style={{ fontSize: "3em" }}>
                  <Icon type="highlight" />{" "}
                </div>
                <p style={{ fontSize: "1.8em" }}>
                  <span>{taskData.label_count}</span> Labels
                </p>
              </div>
              <div
                className="cardContainer"
                style={{
                  textAlign: "center",
                  width: "100%",
                  height: "25%",
                }}
              >
                <div style={{ fontSize: "3em" }}>
                  <Icon type="picture" />{" "}
                </div>
                <p style={{ fontSize: "1.8em" }}>
                  <span>{taskData.frames_total}</span> Frames
                </p>
              </div>
            </div>
            <div
              // COLUMN 2
              className="cardContainer"
              style={{ flex: 3, height: "100%" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "90%",
                  padding: "20px",
                }}
              >
                <Doughnut
                  data={doughnutData}
                  options={{
                    title: {
                      display: true,
                      text: "Progress",
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              </div>
            </div>
            <div
              // COLUMN 3
              className="cardContainer"
              style={{ display: "flex", flex: 4, height: "100%" }}
            >
              <div style={{ width: "100%" }}>
                <Bar
                  data={barData}
                  options={{
                    title: {
                      display: true,
                      text: "Label Dataset",
                    },
                    scales: {
                      yAxes: [{
                         ticks: {
                            stepSize: 1,
                            beginAtZero: true
                         }
                      }]
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </Spin>
    </>
  );
};

export default TaskCards;
