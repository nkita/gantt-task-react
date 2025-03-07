import React, { useRef, useEffect, useState } from "react";
import { Task } from "../../types/public-types";
import { BarTask } from "../../types/bar-task";
import styles from "./tooltip.module.css";

export type TooltipProps = {
  task: BarTask;
  arrowIndent: number;
  rtl: boolean;
  svgContainerHeight: number;
  svgContainerWidth: number;
  svgWidth: number;
  headerHeight: number;
  taskListWidth: number;
  scrollX: number;
  scrollY: number;
  rowHeight: number;
  fontSize: string;
  fontFamily: string;
  TooltipContent: React.FC<{
    task: Task;
    fontSize: string;
    fontFamily: string;
  }>;
};
export const Tooltip: React.FC<TooltipProps> = ({
  task,
  rowHeight,
  rtl,
  svgContainerHeight,
  svgContainerWidth,
  scrollX,
  scrollY,
  arrowIndent,
  fontSize,
  fontFamily,
  headerHeight,
  taskListWidth,
  TooltipContent,
}) => {
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [relatedY, setRelatedY] = useState(0);
  const [relatedX, setRelatedX] = useState(0);
  useEffect(() => {
    if (tooltipRef.current) {
      const tooltipHeight = tooltipRef.current.offsetHeight * 1.1;
      const tooltipWidth = tooltipRef.current.offsetWidth * 1.1;

      let newRelatedY = task.index * rowHeight - scrollY + headerHeight;
      let newRelatedX: number;
      if (rtl) {
        newRelatedX = task.x1 - arrowIndent * 1.5 - tooltipWidth - scrollX;
        if (newRelatedX < 0) {
          newRelatedX = task.x2 + arrowIndent * 1.5 - scrollX;
        }
        const tooltipLeftmostPoint = tooltipWidth + newRelatedX;
        if (tooltipLeftmostPoint > svgContainerWidth) {
          newRelatedX = svgContainerWidth - tooltipWidth;
          newRelatedY += rowHeight;
        }
      } else {
        const fullChartWidth = taskListWidth + svgContainerWidth;
        newRelatedX = task.x2 + arrowIndent * 1.5 + taskListWidth - scrollX;
        const tooltipRightmostPoint = tooltipWidth + newRelatedX;
        
        if (tooltipRightmostPoint > fullChartWidth) {
          newRelatedX = task.x1 + taskListWidth - arrowIndent * 1.5 - scrollX - tooltipWidth;
        }
        
        if (newRelatedX < taskListWidth) {
          newRelatedX = taskListWidth;
          newRelatedY += rowHeight;
        }
      }

      const tooltipLowerPoint = tooltipHeight + newRelatedY - scrollY;
      if (tooltipLowerPoint > svgContainerHeight - scrollY) {
        newRelatedY = svgContainerHeight - tooltipHeight;
      }
      setRelatedY(newRelatedY);
      setRelatedX(newRelatedX);
    }
  }, [
    tooltipRef,
    task,
    arrowIndent,
    scrollX,
    scrollY,
    headerHeight,
    taskListWidth,
    rowHeight,
    svgContainerHeight,
    svgContainerWidth,
    rtl,
  ]);

  return (
    <div
      ref={tooltipRef}
      className={
        relatedX
          ? styles.tooltipDetailsContainer
          : styles.tooltipDetailsContainerHidden
      }
      style={{ left: relatedX, top: relatedY }}
    >
      <TooltipContent task={task} fontSize={fontSize} fontFamily={fontFamily} />
    </div>
  );
};

export const StandardTooltipContent: React.FC<{
  task: Task;
  fontSize: string;
  fontFamily: string;
}> = ({ task, fontSize, fontFamily }) => {
  const style = {
    fontSize,
    fontFamily,
  };

  const getJapaneseDayOfWeek = (date: Date) => {
    const days = ['日', '月', '火', '水', '木', '金', '土'];
    return days[date.getDay()];
  };

  return (
    <div className={styles.tooltipDefaultContainer} style={style}>
      {`${task.start.getFullYear()}年${task.start.getMonth() + 1
      }月${task.start.getDate()}日 (${getJapaneseDayOfWeek(task.start)}) - ${task.end.getFullYear()}年${
        task.end.getMonth() + 1
      }月${task.end.getDate()}日 (${getJapaneseDayOfWeek(task.end)})`}
      {task.end.getTime() - task.start.getTime() !== 0 && (
        <p className={styles.tooltipDefaultContainerParagraph}>{`日数: ${~~(
          (task.end.getTime() - task.start.getTime()) /
          (1000 * 60 * 60 * 24)
        )} 日`}</p>
      )}

      <p className={styles.tooltipDefaultContainerParagraph}>
        {!!task.progress && `Progress: ${task.progress} %`}
      </p>
    </div>
  );
};
