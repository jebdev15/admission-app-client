import React from "react";
import axiosInstance from "@api/index";
import axios from "axios";
import { FormatDateUtil } from "@utils/formatDate";
import { ProtectedRouteContext } from "@pages/Admin/ProtectedRoute";

const useFetch = (url: string, token: string) => {
  const { refresh } = React.useContext(ProtectedRouteContext)
  const [data, setData] = React.useState([]);
  const [error, setError] = React.useState<Error | null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(url, {
          headers: { Authorization: `Bearer ${token}` },
          signal,
        });
        if (!signal.aborted) {
          if (response.data?.applicants.length > 0) {
            const apiDataWithId = response.data?.applicants
            .filter((value: any) => value.name !== null)
            .map(
              (value: any, index: number) => {
                return {
                  id: ++index,
                  uuid: value.uuid,
                  applicant_id: value.applicant_id,
                  name: value.name,
                  emailAddress: value.emailAddress,
                  contactNo: value.contactNo,
                  date_of_birth: FormatDateUtil.formatDateOnly(
                    value.date_of_birth
                   ),
                  campus: value.campus,
                  examVenue: value.examVenue,
                  imageName: value.image_name,
                  scheduleDate: `${FormatDateUtil.formatDateOnly(value.schedule_date)} ${value.schedule_time}`,
                  admission_status: value.admission_status,
                  enrollment_status: value.enrollment_status
                };
              }
            );
            setData(apiDataWithId);
          }
        }
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Request canceled");
        } else {
          if (!signal.aborted) {
            setError(error as Error);
          }
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };
    fetchData();
    return () => controller.abort();
  }, [url, token]);
  React.useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const fetchData = async () => {
      // setLoading(true);
      try {
        const response = await axiosInstance.get(url, {
          headers: { Authorization: `Bearer ${token}` },
          signal,
        });
        if (!signal.aborted) {
          if (response.data?.applicants.length > 0) {
            const apiDataWithId = response.data?.applicants
            .filter((value: any) => value.name !== null)
            .map(
              (value: any, index: number) => {
                return {
                  id: ++index,
                  uuid: value.uuid,
                  applicant_id: value.applicant_id,
                  name: value.name,
                  emailAddress: value.emailAddress,
                  contactNo: value.contactNo,
                  date_of_birth: FormatDateUtil.formatDateOnly(
                    value.date_of_birth
                   ),
                  campus: value.campus,
                  examVenue: value.examVenue,
                  imageName: value.image_name,
                  scheduleDate: `${FormatDateUtil.formatDateOnly(value.schedule_date)} ${value.schedule_time}`,
                  program: value.program,
                  admission_status: value.admission_status,
                  program_status: value.program_status
                };
              }
            );
            setData(apiDataWithId);
          }
        }
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Request canceled");
        } else {
          if (!signal.aborted) {
            setError(error as Error);
          }
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };
    fetchData();
    return () => controller.abort();
  },[refresh])
  return { data, error, loading };
};

export default useFetch;
