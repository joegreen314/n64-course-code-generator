import React, { useState } from 'react';
import './App.css';
import {courses, CourseKey, CoursePreferences} from './codes'
import { DndProvider, DropTargetMonitor, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

type Color = 'red' | 'orange' | 'yellow' | 'green' | 'teal' | 'brown'

interface courseIconContainerProps {
  courseKey: CourseKey,
  currentTier: string,
  setItems: any,
}

function CourseIconContainer({courseKey, currentTier, setItems}: courseIconContainerProps) {
  const changeCourseTier = (currentItem: {course: CourseKey, type: string}, tier: string) => {
    setItems((courseTiers: CourseTierPlacement[]) => {
        return courseTiers.map((courseTier: CourseTierPlacement) => {
            return {
                ...courseTier,
                tier: courseTier.course === currentItem.course ? tier : courseTier.tier,
            }
        })
    });
  }

  const [{ isDragging }, drag] = useDrag({
    item: { course: courseKey, type: 'courseIcon' },
    end: (item, monitor) => {
        const dropResult = monitor.getDropResult();
        if(dropResult && item) {
            changeCourseTier(item, dropResult.name)
        }
    },
    collect: (monitor) => ({
        isDragging: monitor.isDragging(),
    }),
  });

  const containerStyle = {
    backgroundImage: `url("/track-icons/${courseKey}.png")`,
    width: '145px',
    height: '90px',
    opacity: isDragging ? .4 : 1,
    display: 'inline-flex'
  }

  return <div ref={drag} style={containerStyle}>
  </div>
}

function TierRow({children, name, color}: {children: React.ReactNode, name: tierName, color: Color}) {
  const [{canDrop, isOver}, drop] = useDrop({
    accept: 'courseIcon',
    drop: () => ({name}),
    collect: (monitor: DropTargetMonitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    })
  })
  const rowStyle = {
    border: 'solid 1px black',
    display: 'inline-flex',
    backgroundColor: '#505050'
  }
  const labelHolderStyle = {
    width: '100px',
    borderRight: 'solid 1px black',
    backgroundColor: color,
    padding: '10px'
    }
  const imageHolderStyle = {
    width: '870px',
    minHeight: '90px',
  }
  return <div style={rowStyle}>
    <div style={labelHolderStyle}>
      <label style={{fontSize: 40}}>{name}</label><br/>
      <label style={{fontSize: 15}}>{`Weight: ${tierWeights[name]}x`}</label>
    </div>
    <div ref={drop} style={imageHolderStyle}>
      {children}
    </div>
  </div>
}

const tierWeights = {
  'S': 2,
  'A': 1.5,
  'B': 1,
  'C': .5,
  'D': .25,
  'F': 0
}

type tierName = 'S' | 'A' | 'B' | 'C' | 'D' | 'F'

const tierNames: tierName[] = ['S', 'A', 'B', 'C', 'D', 'F']

interface CourseTierPlacement {
  id: number,
  course: CourseKey,
  tier: string
}

interface TierListProps{
  courseTiers: CourseTierPlacement[],
  updateTiers: React.Dispatch<React.SetStateAction<CourseTierPlacement[]>>
}

function TierList({courseTiers, updateTiers}: TierListProps) {

  const returnCoursesForTier = (tierName: string) => {
    return courseTiers.filter((course: CourseTierPlacement) => course.tier === tierName).map((course: CourseTierPlacement, index: number) => {
      return <CourseIconContainer key={course.id}
                    courseKey={course.course}
                    currentTier={course.tier}
                    setItems={updateTiers}
      />
    });
  }

  const rowColors: Color[] = ['red', 'orange', 'yellow', 'green', 'teal', 'brown']

  return <div>
      <DndProvider backend={HTML5Backend}>
        {tierNames.map((name, index)=>{
          return <TierRow name={name} color={rowColors[index]}>
              {returnCoursesForTier(name)}
            </TierRow>
        })}
      </DndProvider>
    </div>
}

export type { TierListProps, CourseTierPlacement }
export { TierList, tierWeights, tierNames };
