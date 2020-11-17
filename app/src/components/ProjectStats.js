/* eslint-disable */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Divider, Icon, Skeleton, message, Button } from "antd";
import "./statistics.css";
import TaskStats from "./TaskStats";
import { Bar, Doughnut } from "react-chartjs-2";

const ProjectStats = ({ project }) => {
  const location = `${process.env.REACT_APP_API_HOST}`;
  const [loading, setLoading] = useState(true);
  const [taskData, setTaskData] = useState({
    task_count: 0,
    frames_total: 0,
    frames_completed: 0,
    label_count: 0
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
        backgroundColor: ["rgb(24,144,255)", "rgb(240,240,240, 0.4)"],
        borderColor: ["rgb(24,144,255)", "rgb(240,240,240)"],

        hoverBackgroundColor: ["rgb(24,144,255,0.8)", "#f5f5f5"],
        // borderColor: "#8c8c8c",
        // hoverBorderColor: '#f0f0f0',
        data: [
          taskData.frames_completed,
          taskData.frames_total - taskData.frames_completed,
        ],
      },
    ],
  };

  const barData = {
    labels: [...Object.keys(labelData)],
    datasets: [
      {
        label: "Label Statistics",

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
        barThickness: 60
      },
    ],
  };

  const getProjectStats = async (projectName) => {
    try{
      const response = await axios({
        method: "GET",
        url: `${location}/api/v1/statistics/project_stats?project=${projectName}`,
        credentials: "include",
        withCredentials: true,
      });
      const dataset = response.data.stats;
      setTaskData({
        task_count: dataset.task_count,
        frames_total: dataset.frames_total,
        frames_completed: dataset.frames_completed,
        label_count: dataset.label_count
      });
      setLabelData({
        ...dataset.reviews,
      });
    }catch(err){
      message.error(err);
    }
    setLoading(false);

  };

  useEffect(() => {
    setLoading(true);
    getProjectStats(project.name);
  }, [project]);

  return (
    <div>
        <h2 style={{ color: "#595959", margin: "10px" }}>
          Project Statistics <Icon type="bar-chart" /> <span style={{paddingLeft: '10px'}}><Button type="primary">Export</Button></span>
        </h2>
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "20px",
          borderRadius: "5px",
        }}
      >
        {loading ? (
          <Skeleton active paragraph={{ rows: 10 }} />
        ) : (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              height: "500px",
              width: "100%",
            }}
          >
            <div
              style={{
                flex: 2,
                padding: "10px",
                height: "100%",
                width: "40%",
              }}
            >
              <h1>{project.name}</h1>
              <div>
                <Doughnut
                  data={doughnutData}
                  options={{
                    title: {
                      display: true,
                      text: "Progress",
                    },
                    responsive: true,
                    maintainAspectRatio: true,
                  }}
                />
                <div>
                  <p>
                    Total Task Count:{" "}
                    <span style={{ color: "#40a9ff" }}>
                      {taskData.task_count}
                    </span>
                  </p>
                  <p>
                  Total Label Count:{" "}
                    <span style={{ color: "#40a9ff" }}>{taskData.label_count}</span>
                  </p>
                  <p>
                  Total Frame Count:{" "}
                    <span style={{ color: "#40a9ff" }}>
                      {taskData.frames_total}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div
              style={{
                flex: 3,
                padding: "10px",
                height: "100%",
                width: "60%",
              }}
            >
              <Bar
                data={barData}
                options={{
                  title: {
                    display: true,
                    text: "Review Dataset",
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
        )}
      </div>
      <Divider style={{ backgroundColor: "#91d5ff" }} />
      <h2 style={{ color: "#595959", margin: "10px", padding: "10px" }}>
        Task Statistics <Icon type="radar-chart" />
      </h2>
      <TaskStats project={project} />
    </div>
  );
};

export default ProjectStats;
