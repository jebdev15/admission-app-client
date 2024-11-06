import React, { useState } from 'react';
import { Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import campusesJson from './campuses.json';
// Define types for the JSON structure
interface Course {
  course_code: string;
  course_description: string;
}

interface College {
  college_code: string;
  college_description: string;
  courses: Course[];
}

interface CampusData {
  colleges: College[];
}

interface Data {
  [campus: string]: CampusData;
}

// Sample JSON Data
const data: Data = campusesJson ;

const CascadingSelect: React.FC = () => {
  const [selectedCampus, setSelectedCampus] = useState<string>('');
  const [selectedCollege, setSelectedCollege] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<string>('');

  const handleCampusChange = (event: SelectChangeEvent<string>) => {
    setSelectedCampus(event.target.value);
    setSelectedCollege('');  // Reset the selected college when campus changes
    setSelectedCourse('');   // Reset the selected course when campus changes
  };

  const handleCollegeChange = (event: SelectChangeEvent<string>) => {
    setSelectedCollege(event.target.value);
    setSelectedCourse('');   // Reset the selected course when college changes
  };

  const handleCourseChange = (event: SelectChangeEvent<string>) => {
    setSelectedCourse(event.target.value);
  };

  const campuses = Object.keys(data); // Extract the list of campuses

  // Get the list of colleges based on the selected campus
  const colleges = selectedCampus ? data[selectedCampus].colleges : [];

  // Get the list of courses based on the selected college
  const courses = selectedCollege ? colleges.find(c => c.college_code === selectedCollege)?.courses || [] : [];

  return (
    <div>
      {/* Campus Select */}
      <FormControl fullWidth margin="normal">
        <InputLabel id="campus-label">Campus</InputLabel>
        <Select
          labelId="campus-label"
          value={selectedCampus}
          onChange={handleCampusChange}
          label="Campus"
          required
        >
          {campuses.map((campus) => (
            <MenuItem key={campus} value={campus}>
              {campus}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* College Select */}
      <FormControl fullWidth margin="normal" disabled={!selectedCampus}>
        <InputLabel id="college-label">College</InputLabel>
        <Select
          labelId="college-label"
          value={selectedCollege}
          onChange={handleCollegeChange}
          label="College"
          required
        >
          {colleges.map((college) => (
            <MenuItem key={college.college_code} value={college.college_code}>
              {college.college_description}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Course Select */}
      <FormControl fullWidth margin="normal" disabled={!selectedCollege}>
        <InputLabel id="course-label">Course</InputLabel>
        <Select
          labelId="course-label"
          value={selectedCourse}
          onChange={handleCourseChange}
          label="Course"
          required
        >
          {courses.map((course) => (
            <MenuItem key={course.course_code} value={course.course_code}>
              {course.course_description}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default CascadingSelect;
