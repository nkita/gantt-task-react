import React, { useRef } from "react";
import { Task, ViewMode, Gantt, GanttRef } from "gantt-task-react";
import { ViewSwitcher } from "./components/view-switcher";
import { getStartEndDateForProject, initTasks } from "./helper";
import "gantt-task-react/dist/index.css";

// Init
const App = () => {
  const ganttRef = useRef<GanttRef>(null);

  const handleScrollUp = () => {
    if (ganttRef.current) {
      const currentY = ganttRef.current.getScrollY();
      ganttRef.current.setScrollY(currentY - 20);
    }
  };

  const handleScrollDown = () => {
    if (ganttRef.current) {
      const currentY = ganttRef.current.getScrollY();
      ganttRef.current.setScrollY(currentY + 20);
    }
  };

  const [view, setView] = React.useState<ViewMode>(ViewMode.Day);
  const [tasks, setTasks] = React.useState<Task[]>(initTasks());
  const [isChecked, setIsChecked] = React.useState(true);
  let columnWidth = 65;
  if (view === ViewMode.Year) {
    columnWidth = 350;
  } else if (view === ViewMode.Month) {
    columnWidth = 300;
  } else if (view === ViewMode.Week) {
    columnWidth = 250;
  }

  const handleTaskChange = (task: Task) => {
    console.log("On date change Id:" + task.id);
    let newTasks = tasks.map(t => (t.id === task.id ? task : t));
    if (task.project) {
      const [start, end] = getStartEndDateForProject(newTasks, task.project);
      const project = newTasks[newTasks.findIndex(t => t.id === task.project)];
      if (
        project.start.getTime() !== start.getTime() ||
        project.end.getTime() !== end.getTime()
      ) {
        const changedProject = { ...project, start, end };
        newTasks = newTasks.map(t =>
          t.id === task.project ? changedProject : t
        );
      }
    }
    setTasks(newTasks);
  };

  const handleTaskDelete = (task: Task) => {
    const conf = window.confirm("Are you sure about " + task.name + " ?");
    if (conf) {
      setTasks(tasks.filter(t => t.id !== task.id));
    }
    return conf;
  };

  const handleProgressChange = async (task: Task) => {
    setTasks(tasks.map(t => (t.id === task.id ? task : t)));
    console.log("On progress change Id:" + task.id);
  };

  const handleDblClick = (task: Task) => {
    alert("On Double Click event Id:" + task.id);
  };

  const handleClick = (task: Task) => {
    console.log("On Click event Id:" + task.id);
  };

  const handleSelect = (task: Task, isSelected: boolean) => {
    console.log(task.name + " has " + (isSelected ? "selected" : "unselected"));
  };

  const handleExpanderClick = (task: Task) => {
    setTasks(tasks.map(t => (t.id === task.id ? task : t)));
    console.log("On expander click Id:" + task.id);
  };

  return (
    <div className="Wrapper">
      <ViewSwitcher
        onViewModeChange={viewMode => setView(viewMode)}
        onViewListChange={setIsChecked}
        isChecked={isChecked}
      />
      <div style={{ position: 'relative' }}>
        <h3>Gantt With Unlimited Height</h3>
        <Gantt
          tasks={tasks}
          viewMode={view}
          onDateChange={handleTaskChange}
          onDelete={handleTaskDelete}
          onProgressChange={handleProgressChange}
          onDoubleClick={handleDblClick}
          onClick={handleClick}
          onSelect={handleSelect}
          onExpanderClick={handleExpanderClick}
          listCellWidth={isChecked ? "155px" : ""}
          locale="ja-JP"
          columnWidth={columnWidth}
          currentLineTaskId="Task 2"
          holidayColor="rgba(250, 250, 250, 0.8)"
          currentLineColor="#E0F2FE"
        />
      </div>
      <h3>Gantt With Limited Height</h3>
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', right: '20px', bottom: '10%', zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button onClick={handleScrollUp} style={{ border: 'none', padding: '10px', borderRadius: '50%', width: '40px', height: '40px', backgroundColor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', cursor: 'pointer', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>↑</button>
          <button onClick={handleScrollDown} style={{ border: 'none', padding: '10px', borderRadius: '50%', width: '40px', height: '40px', backgroundColor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', cursor: 'pointer', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>↓</button>
        </div>
        <Gantt
          ref={ganttRef}
          tasks={tasks}
          viewMode={view}
          onDateChange={handleTaskChange}
          onDelete={handleTaskDelete}
          onProgressChange={handleProgressChange}
          onDoubleClick={handleDblClick}
          onClick={handleClick}
          onSelect={handleSelect}
          onExpanderClick={handleExpanderClick}
          listCellWidth={isChecked ? "155px" : ""}
          ganttHeight={300}
          columnWidth={columnWidth}
        />
      </div>
    </div>
  );
};

export default App;
