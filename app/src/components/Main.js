/* eslint-disable no-shadow */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Select } from "antd";
import "./statistics.css";
import ProjectStats from "./ProjectStats";

const { Option } = Select;

const ProjectSelector = () => {
  const location = `${process.env.REACT_APP_API_HOST}`;
  const [select, setSelect] = useState({
    name: "",
    num_tasks: 0,
  });
  const [projectList, setProjectList] = useState([]);

  useEffect(() => {
    const projectOptions = [];

    const fetchAllProjects = async () => {
      try {
        const response = await axios(`${location}/api/v1/project-public`, {
          method: "GET",
          credentials: "include",
          withCredentials: true,
        });
        const data = response.data;
        for (let i = 0; i < data.length; i++) {
          projectOptions.push({
            name: data[i].name,
            num_tasks: data[i].num_of_tasks,
          });
        }
        setProjectList(projectOptions);
      } catch (err) {
        console.log(err);
      }
    };

    fetchAllProjects();
  }, []);

  const handleChange = (value) => {
    setSelect({
      name: value,
      num_tasks: projectList.find((entry) => entry.name === value).num_tasks,
    });
  };

  const placeholder = <div>{translate("statistics.select_project")}</div>;

  return projectList.length ? (
    <>
      <h1>Statistics</h1>
      <div style={{ marginBottom: "20px" }}>
        <Select style={{ width: 120 }} onChange={handleChange}>
          {projectList.map((project) => (
            <Option key={project.name}>{project.name}</Option>
          ))}
        </Select>
      </div>
      {!select.num_tasks ? (
        "Please Select a Project"
      ) : (
        <ProjectStats project={select} />
      )}
    </>
  ) : null;
};

export default ProjectSelector;
