import { useEffect } from "react";
import { useContext, useState } from "react";
import Select from "react-select";
import { ApplicationContext } from "../../context/ApplicationContext";
import Form from "react-bootstrap/Form";

const ApplicationContainer = (props) => {
  const { applications } = props;
  const { selectedApplication, setSelectedApplication } =
    useContext(ApplicationContext);
  const [applicationValue, setApplicationValue] = useState("");

  useEffect(() => {
    if (selectedApplication) {
      setApplicationValue({
        value: selectedApplication.app_acronym,
        label: selectedApplication.app_acronym,
      });
    }
  }, [selectedApplication]);

  const options = applications?.map((app) => {
    return {
      value: app.app_acronym,
      label: app.app_acronym,
    };
  });

  const setApplication = ({ value }) => {
    const application = applications.find((ele) => {
      return ele.app_acronym === value;
    });
    setSelectedApplication(application);
  };

  return (
    <div className="my-3">
     <Form.Label htmlFor="description">Select Application</Form.Label>
      <Select
        options={options}
        value={applicationValue}
        onChange={(value) => setApplication(value)}
    
      />
    </div>
  );
};

export default ApplicationContainer;
