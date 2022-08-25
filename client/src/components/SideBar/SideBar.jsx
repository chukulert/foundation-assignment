import { useEffect } from "react";
import { useState } from "react";
import { useContext } from "react";
import { ApplicationContext } from "../../context/ApplicationContext";
import styles from "./SideBar.module.css";
import AppDropList from "./AppDropList";
import AppModal from "../AppModal";
import ApplicationModalDetails from "../Application/ApplicationModalDetails";

const SideBar = (props) => {
  const { handleShowModal, allGroupsData } = props;
  const { applications, plans, tasks } = useContext(ApplicationContext);
  const [mappedItems, setMappedItems] = useState([]);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [modalDisplayedApplication, setModalDisplayedApplication] =
    useState(null);
  const [modalDisplayedPlan, setModalDisplayedPlan] = useState(null);
  const [modalType, setModalType] = useState(null);

  useEffect(() => {
    if (applications && tasks && plans) {
      const map = applications.map((app) => {
        return { ...app };
      });
      const plansMap = plans.map((plan) => {
        return { ...plan };
      });

      plansMap.forEach((plan) => {
        const appIndex = map.findIndex(
          (app) => app.app_acronym === plan.plan_app_acronym
        );

        if (map[appIndex].plans) {
          map[appIndex].plans.push(plan);
        } else {
          map[appIndex].plans = [plan];
        }
      });

      tasks.forEach((task) => {
        const appIndex = map.findIndex(
          (app) => app.app_acronym === task.task_app_acronym
        );
        if (task.task_plan) {
          const planIndex = map[appIndex].plans.findIndex(
            (plan) => plan.plan_mvp_name === task.task_plan
          );
          if (map[appIndex].plans[planIndex].tasks) {
            map[appIndex].plans[planIndex].tasks.push(task);
          } else {
            map[appIndex].plans[planIndex].tasks = [task];
          }
        } else {
          if (map[appIndex].tasks) {
            map[appIndex].tasks.push(task);
          } else {
            map[appIndex].tasks = [task];
          }
        }
      });

      setMappedItems(map);
    }
    return () => setMappedItems([]);
  }, [applications, tasks, plans]);

  const handleShowApplicationModal = (type) => {
    showApplicationModal
      ? setShowApplicationModal(false)
      : setShowApplicationModal(true);
    if (!modalType && type) {
      setModalType(type);
    } else {
      setModalType(null);
    }
  };

  const handleAppClick = (e) => {
    setModalDisplayedPlan(null);
    const app = applications.find((app) => app.app_acronym === e.target.id);
    setModalDisplayedApplication(app);
    handleShowApplicationModal("Application");
  };

  const handlePlanClick = (e) => {
    setModalDisplayedApplication(null);
    const plan = plans.find((plan) => plan.plan_mvp_name === e.target.id);
    const application = applications.find(app => app.app_acronym === plan.plan_app_acronym)
    setModalDisplayedPlan(plan);
    setModalDisplayedApplication(application);
    handleShowApplicationModal("Plan");
  };

  const applicationList = mappedItems?.map((app) => (
    <AppDropList
      app={app}
      key={app.app_acronym}
      handlePlanClick={handlePlanClick}
      handleShowModal={handleShowModal}
      handleAppClick={handleAppClick}
    />
  ));

  return (
    <>
      <div className={`${styles.container} bg-light`}>
        <strong className="px-2">Applications</strong>
        {applicationList}
      </div>
      <AppModal
        showModal={showApplicationModal}
        title={`${modalType} details`}
        handleShowModal={handleShowApplicationModal}
      >
        <ApplicationModalDetails
          allGroupsData={allGroupsData}
          application={modalDisplayedApplication}
          setModalDisplayedApplication={setModalDisplayedApplication}
          plan={modalDisplayedPlan}
          modalType={modalType}
        />
      </AppModal>
    </>
  );
};

export default SideBar;
