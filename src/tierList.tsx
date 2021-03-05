import React, { useState } from 'react';
import './App.css';
import {courses, CourseKey} from './codes'
import { DndProvider, DropTargetMonitor, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

type Color = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'brown'

interface courseIconContainerProps {
  courseKey: CourseKey,
  currentTier: string,
  setItems: any,
}

function CourseIconContainer({courseKey, currentTier, setItems}: courseIconContainerProps) {
  const changeCourseTier = (currentItem: any, tier: string) => {
    setItems((prevState: any) => {
        return prevState.map((e: any) => {
            return {
                ...e,
                tier: e.course === currentItem.course ? tier : e.tier,
            }
        })
    });
  }

  const [{ isDragging }, drag] = useDrag({
    item: { course: courseKey, type: 'courseIcon' },
    end: (item, monitor) => {
        const dropResult = monitor.getDropResult();
        if(dropResult) {
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

function TierRow({children, name, color}: {children: React.ReactNode, name: string, color: Color}) {
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
    display: 'inline-flex'
  }
  const labelHolderStyle = {
    width: '100px',
    borderRight: 'solid 1px black',
    backgroundColor: color,
    fontSize: 40,
    padding: '10px'
    }
  const imageHolderStyle = {
    width: '800px',
    minHeight: '90px',
  }
  return <div style={rowStyle}>
    <div style={labelHolderStyle}>{name}</div>
    <div ref={drop} style={imageHolderStyle}>
      {children}
    </div>
  </div>
}

interface courseState {
  id: number,
  course: CourseKey,
  tier: string
}

function TierList({updateTiers}: {updateTiers:(tierList: courseState[])=>void}) {
  const [items, setItems] = useState((Object.keys(courses) as CourseKey[]).map((courseKey, index)=>({
    course: courseKey,
    tier: 'B',
    id: index
  })));
  updateTiers(items)

  const returnCoursesForTier = (tier: string) => {
    return items.filter((item) => item.tier === tier).map((item, index) => {
      return <CourseIconContainer key={item.id}
                    courseKey={item.course}
                    currentTier={item.tier}
                    setItems={setItems}
      />
    });
  }

  const rowNames = ['S', 'A', 'B', 'C', 'D', 'F']
  const rowColors: Color[] = ['red', 'orange', 'yellow', 'green', 'blue', 'brown']

  return <div>
      <DndProvider backend={HTML5Backend}>
        {rowNames.map((name, index)=>{
          return <TierRow name={name} color={rowColors[index]}>
              {returnCoursesForTier(name)}
            </TierRow>
        })}
      </DndProvider>
    </div>
}

export type { courseState }
export { TierList };
