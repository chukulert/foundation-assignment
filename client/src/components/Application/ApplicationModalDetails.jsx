import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import { formatDateString } from "../../utils/helpers";
import Button from "react-bootstrap/Button";
import ApplicationEditForm from "./ApplicationEditForm";
import { capitalizeFirstLetter } from "../../utils/helpers";

const ApplicationModalDetails = (props) => {
  const { application, plan, allGroupsData, setModalDisplayedApplication } = props;
  const [showEditForm, setShowEditForm] = useState(false);
  const [permitCreate, setPermitCreate] = useState("");
  const [permitToDo, setPermitToDo] = useState("");
  const [permitDoing, setPermitDoing] = useState("");
  const [permitDone, setPermitDone] = useState("");
  const [permitClose, setPermitClose] = useState("");

  useEffect(() => {
    const appPermitCreate = compareGroups(
      allGroupsData,
      JSON.parse(application.app_permit_create)
    );
    const appPermitToDo = compareGroups(
      allGroupsData,
      JSON.parse(application.app_permit_toDoList)
    );
    const appPermitDoing = compareGroups(
      allGroupsData,
      JSON.parse(application.app_permit_doing)
    );
    const appPermitDone = compareGroups(
      allGroupsData,
      JSON.parse(application.app_permit_done)
    );
    const appPermitClose = compareGroups(
      allGroupsData,
      JSON.parse(application.app_permit_close)
    );
    setPermitCreate(appPermitCreate);
    setPermitToDo(appPermitToDo);
    setPermitDoing(appPermitDoing);
    setPermitDone(appPermitDone);
    setPermitClose(appPermitClose);
  }, [allGroupsData, application]);

  const compareGroups = (allGroupsData, appPermission) => {
    const arr1 = [...allGroupsData];
    return arr1.filter((group) => {
      if (appPermission.includes(group.id)) return group;
    });
  };

  //arr of groupnames
  const getUserGroupString = (arr) => {
    return arr.reduce((prev, current, index) => {
      if (index !== arr.length - 1) {
        return (prev += ` ${capitalizeFirstLetter(current.name)} | `);
      } else {
        return (prev += ` ${capitalizeFirstLetter(current.name)} `);
      }
    }, "");
  };

  return (
    <Container className="smallFont">
      {application && (
        <div className="mt-3">
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
          {permitCreate && (
            <p>
              <strong>Create new task: </strong>
              {getUserGroupString(permitCreate)}
            </p>
          )}
          {permitToDo && (
            <p>
              <strong>Approve new task: </strong>
              {getUserGroupString(permitToDo)}
            </p>
          )}
          {permitDoing && (
            <p>
              <strong> Update task state to "Doing": </strong>
              {getUserGroupString(permitDoing)}
            </p>
          )}
          {permitDone && (
            <p>
              <strong> Update task state to "Done": </strong>
              {getUserGroupString(permitDone)}
            </p>
          )}
          {permitClose && (
            <p>
              <strong>Approve completed task: </strong>
              {getUserGroupString(permitClose)}
            </p>
          )}
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
            {`${formatDateString(plan.plan_startDate)} - ${formatDateString(
              plan.plan_endDate
            )}`}
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
      {showEditForm && (
        <ApplicationEditForm
          allGroupsData={allGroupsData}
          application={application}
          permitCreate={permitCreate}
          permitToDo={permitToDo}
          permitDoing={permitDoing}
          permitDone={permitDone}
          permitClose={permitClose}
          setModalDisplayedApplication={setModalDisplayedApplication}
        />
      )}
      {!showEditForm && (
        <Button
          variant="primary"
          size="sm"
          className="my-3"
          onClick={() =>
            showEditForm ? setShowEditForm(false) : setShowEditForm(true)
          }
        >
          Edit permission settings
        </Button>
      )}
    </Container>
  );
};

export default ApplicationModalDetails;
