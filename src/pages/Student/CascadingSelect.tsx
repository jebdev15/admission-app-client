import React, { useState } from 'react';
import { Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';

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
const data: Data = {
    "Talisay": {
      "colleges": [
        {
          "college_code": "CAS",
          "college_description": "College of Arts and Sciences",
          "courses": [
            { "course_code": "AB-ENG", "course_description": "Bachelor of Arts in English Language" },
            { "course_code": "AB SOC-SCI", "course_description": "Social Science" },
            { "course_code": "BPA", "course_description": "Bachelor of Public Administration" },
            { "course_code": "BSAM", "course_description": "Bachelor of Science in Applied Mathematics" },
            { "course_code": "BS PSYCH", "course_description": "Bachelor of Science in Psychology" }
          ]
        },
        {
          "college_code": "CBMA",
          "college_description": "College of Business Management and Accountancy",
          "courses": [
            { "course_code": "BSHM", "course_description": "Bachelor of Science in Hospitality Management" }
          ]
        },
        {
          "college_code": "CCS",
          "college_description": "College of Computer Studies",
          "courses": [
            { "course_code": "BSIS", "course_description": "Bachelor of Science in Information Systems" }
          ]
        },
        {
          "college_code": "COED",
          "college_description": "College of Education",
          "courses": [
            { "course_code": "BECED", "course_description": "Bachelor of Early Childhood Education" },
            { "course_code": "BEED", "course_description": "Bachelor of Elementary Education" },
            { "course_code": "BPED", "course_description": "Bachelor of Physical Education" },
            { "course_code": "BSED ENG", "course_description": "Bachelor of Secondary Education with major in English" },
            { "course_code": "BSED FIL", "course_description": "Bachelor of Secondary Education with major in Filipino" },
            { "course_code": "BSED MATH", "course_description": "Bachelor of Secondary Education with major in Mathematics" },
            { "course_code": "BSED SCIENCE", "course_description": "Bachelor of Secondary Education with major in Science" },
            { "course_code": "BSNED", "course_description": "Bachelor of Special Needs Education" },
            { "course_code": "BTLED HE", "course_description": "Bachelor of Technology and Livelihood Education major in Home Economics" },
            { "course_code": "BTLED IA", "course_description": "Bachelor of Technology and Livelihood Education major in Industrial Arts" }
          ]
        },
        {
          "college_code": "COE",
          "college_description": "College of Engineering",
          "courses": [
            { "course_code": "BSCE", "course_description": "Bachelor of Science in Civil Engineering" }
          ]
        },
        {
          "college_code": "CIT",
          "college_description": "College of Industrial Technology",
          "courses": [
            { "course_code": "BIT DRAFTING", "course_description": "Bachelor of Industrial Technology major in Architectural Drafting Technology" },
            { "course_code": "BIT AUTOTECH", "course_description": "Bachelor of Industrial Technology major in Automotive Technology" },
            { "course_code": "BIT ELEC", "course_description": "Bachelor of Industrial Technology major in Electrical Technology" },
            { "course_code": "BIT ELEX", "course_description": "Bachelor of Industrial Technology major in Electronics Technology" },
            { "course_code": "BIT AFT", "course_description": "Bachelor of Industrial Technology major in Fashion and Apparel Technology" },
            { "course_code": "BIT CT", "course_description": "Bachelor of Industrial Technology major in Culinary Technology" },
            { "course_code": "BIT MECHTECH", "course_description": "Bachelor of Industrial Technology major in Mechanical Technology" },
            { "course_code": "BIT HVACRT", "course_description": "Bachelor of Industrial Technology major in Refrigeration and Air-conditioning Technology" }
          ]
        }
      ]
    },
    "Fortune Towne": {
      "colleges": [
        {
          "college_code": "CBMA",
          "college_description": "College of Business Management and Accountancy",
          "courses": [
            { "course_code": "BSA", "course_description": "Bachelor of Science in Accountancy" },
            { "course_code": "BSBA", "course_description": "Bachelor of Science in Business Administration major in Financial Management" },
            { "course_code": "BS ENTREP", "course_description": "Bachelor of Science in Entrepreneurship" },
            { "course_code": "BSMA", "course_description": "Bachelor of Science in Management Accounting" },
            { "course_code": "BSOA", "course_description": "Bachelor of Science in Office Administration" }
          ]
        },
        {
          "college_code": "CCS",
          "college_description": "College of Computer Studies",
          "courses": [
            { "course_code": "BSIS", "course_description": "Bachelor of Science in Information Systems" }
          ]
        }
      ]
    },
    "Binalbagan": {
      "colleges": [
        {
          "college_code": "CBMA",
          "college_description": "College of Business Management and Accountancy",
          "courses": [
            { "course_code": "BSBA", "course_description": "Bachelor of Science in Business Administration major in Financial Management" }
          ]
        },
        {
          "college_code": "CCS",
          "college_description": "College of Computer Studies",
          "courses": [
            { "course_code": "BSIS", "course_description": "Bachelor of Science in Information Systems" },
            { "course_code": "BSIT", "course_description": "Bachelor of Science in Information Technology" }
          ]
        },
        {
          "college_code": "COED",
          "college_description": "College of Education",
          "courses": [
            { "course_code": "BEED", "course_description": "Bachelor of Elementary Education" },
            { "course_code": "BSED SCIENCE", "course_description": "Bachelor of Secondary Education with major in Science" },
            { "course_code": "BTLED HE", "course_description": "Bachelor of Technology and Livelihood Education major in Home Economics" }
          ]
        },
        {
          "college_code": "COF",
          "college_description": "College of Fisheries",
          "courses": [
            { "course_code": "BSF", "course_description": "Bachelor of Science in Fisheries" }
          ]
        }
      ]
    },
    "Alijis": {
      "colleges": [
        {
          "college_code": "CCS",
          "college_description": "College of Computer Studies",
          "courses": [
            { "course_code": "BSIS", "course_description": "Bachelor of Science in Information Systems" },
            { "course_code": "BSIT", "course_description": "Bachelor of Science in Information Technology" }
          ]
        },
        {
          "college_code": "COED",
          "college_description": "College of Education",
          "courses": [
            { "course_code": "BTVTED ELT", "course_description": "Bachelor of Technical Vocational Teacher Education major in Electrical Technology" },
            { "course_code": "BTVTED ECT", "course_description": "Bachelor of Technical Vocational Teacher Education major in Electronics Technology" }
          ]
        },
        {
          "college_code": "COE",
          "college_description": "College of Engineering",
          "courses": [
            { "course_code": "BSCpE", "course_description": "Bachelor of Science in Computer Engineering" },
            { "course_code": "BSECE", "course_description": "Bachelor of Science in Electronics Engineering" }
          ]
        },
        {
          "college_code": "CIT",
          "college_description": "College of Industrial Technology",
          "courses": [
            { "course_code": "BIT DRAFTING", "course_description": "Bachelor of Industrial Technology major in Architectural Drafting Technology" },
            { "course_code": "BIT AUTOTECH", "course_description": "Bachelor of Industrial Technology major in Automotive Technology" },
            { "course_code": "BIT COMTECH", "course_description": "Bachelor of Industrial Technology major in Computer Technology" },
            { "course_code": "BIT ELEC", "course_description": "Bachelor of Industrial Technology major in Electrical Technology" },
            { "course_code": "BIT ELEX", "course_description": "Bachelor of Industrial Technology major in Electronics Technology" },
            { "course_code": "BIT CT", "course_description": "Bachelor of Industrial Technology major in Culinary Technology" },
            { "course_code": "BIT MECHTECH", "course_description": "Bachelor of Industrial Technology major in Mechanical Technology" }
          ]
        }
      ]
    }
  } ;

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
