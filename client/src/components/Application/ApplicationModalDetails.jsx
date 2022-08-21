import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import { formatDateString } from "../../utils/helpers";
import Button from "react-bootstrap/Button";

const ApplicationModalDetails = (props) => {
  const { application, plan, allGroupsData } = props;
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    console.log(allGroupsData);
  }, []);

  return (
    <Container className="smallFont">
      {application && (
        <div className="mt-3 border-bottom">
          <p>
            <strong>Application: </strong>
            {application.app_acronym}
          </p>
          <p>
            <strong>Date: </strong>
            {`${formatDateString(
              application.app_startDate
            )} - ${formatDateString(application.app_endDate)}`}
          </p>
          <p className="d-flex">
            <strong>Description: </strong>
            <textarea
              readOnly={true}
              className="mx-3"
              cols="60"
              value={application.app_description}
            ></textarea>
          </p>
          <p className="border-top">
            <strong>Permission Settings</strong>
          </p>
          <p>
            <strong>Create new task: </strong>
            {application.app_permit_create}
          </p>
          <p>
            <strong>Approve new task: </strong>
            {application.app_permit_toDoList}
          </p>
          <p>
            <strong> Update task state to "Doing": </strong>
            {application.app_permit_doing}
          </p>
          <p>
            <strong> Update task state to "Done": </strong>
            {application.app_permit_done}
          </p>
          <p>
            <strong>Approve completed task: </strong>
            {application.app_permit_close}
          </p>
        </div>
      )}
      {plan && (
        <div className="mt-3 border-bottom">
          <p>
            <strong>Plan: </strong>
            {plan.plan_mvp_name}
          </p>
          <p>
            <strong>Application: </strong>
            {plan.plan_app_acronym}
          </p>
          <p>
            <strong>Date: </strong>
            {`${formatDateString(plan.plan_startDate)} - ${formatDateString(plan.plan_endDate)}`}
          </p>
          <p className="d-flex">
            <strong>Description: </strong>
            <textarea
              readOnly={true}
              className="mx-3"
              cols="60"
              value={plan.plan_description}
            ></textarea>
          </p>
          <p>
            <strong>Color: </strong>
            {plan.plan_color}
          </p>
        </div>
      )}
      <Button
        variant="primary"
        size="sm"
        className="my-3"
        onClick={() =>
          showEditForm ? setShowEditForm(false) : setShowEditForm(true)
        }
      >
        Edit
      </Button>
    </Container>
  );
};

export default ApplicationModalDetails;
