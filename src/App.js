
import React, { useRef, useState } from 'react';
import { Modal, Button, Input, Space } from 'antd';
import { useCallback, useReducer } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { data } from "./data";
import produce from "immer";

const dragReducer = produce((draft, action) => {
  switch (action.type) {
    case "MOVE": {
      draft[action.from] = draft[action.from] || [];
      draft[action.to] = draft[action.to] || [];
      const [removed] = draft[action.from].splice(action.fromIndex, 1);
      draft[action.to].splice(action.toIndex, 0, removed);
    }
    case "ADD_PERSON": {
      if (action.payload && action.payload.person) {
        const { person } = action.payload;
        draft.items.push(person); // Assuming you want to add to items array
      }
      break; // Add break statement
    }
    default:
      break;
  }
});

const Index = () => {
  const [open, setOpen] = useState(false);
  const [firstName, setFirstName] = useState("firstname");
  const [lastName, setLastName] = useState("lastname");
  const [disabled, setDisabled] = useState(true);
  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  });
  const draggleRef = useRef(null);
  const showModal = () => {
    setOpen(true);
  };
  const handleOk = (e) => {
    console.log(e);
    add({first:firstName, last:lastName})
    setOpen(false);
  };
  const handleCancel = (e) => {
    console.log(e);
    setOpen(false);
  };
  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
  };

  const onStart = (_event, uiData) => {
    const { clientWidth, clientHeight } = window.document.documentElement;
    const targetRect = draggleRef.current?.getBoundingClientRect();
    if (!targetRect) {
      return;
    }
    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y),
    });
  };
  const [state, dispatch] = useReducer(dragReducer, {
    items: data.splice(0,2),
    items2: data.splice(2, data.length-1),
  });
  const add = (props) => {
    let random = Math.random() + "123d341cc119a50d1adb972"; // Corrected random generation
    let newPerson = {
      id: random,
      picture: 'http://placehold.it/32x32',
      name: {
        first: props.name,
        last: props.last,
      },
    };
  
    dispatch({
      type: "ADD_PERSON",
      payload: { person: newPerson },
    });
  };
  const onDragEnd = useCallback((result) => {
    if (result.reason === "DROP") {
      if (!result.destination) {
        return;
      }
      dispatch({
        type: "MOVE",
        from: result.source.droppableId,
        to: result.destination.droppableId,
        fromIndex: result.source.index,
        toIndex: result.destination.index,
      });
    }
  }, []);

  return (
    <>
    
    <div className='aer'>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="items" type="PERSON">
          {(provided, snapshot) => {
            return (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {state.items?.map((person, index) => {
                  return (
                    <Draggable
                      key={person.id}
                      draggableId={person.id}
                      index={index}
                    >
                      {(provided, snapshot) => {
                        return (
                          <div
                            
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            
                          >
                            <div >
                              <img
                                src={person.picture}
                                
                              />
                              <span>
                                {person.name.first} {person.name.last}
                              </span>
                            </div>
                          </div>
                        );
                      }}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            );
          }}
        </Droppable>
        <Droppable droppableId="items2" type="PERSON">
          {(provided, snapshot) => {
            return (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                
              >
                {state.items2?.map((person, index) => {
                  return (
                    <Draggable
                      key={person.id}
                      draggableId={person.id}
                      index={index}
                    >
                      {(provided, snapshot) => {
                        return (
                          <div
                            
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <div >
                              <img
                                src={person.picture}
                               
                              />
                              <span>
                                {person.name.first} {person.name.last}
                              </span>
                            </div>
                          </div>
                        );
                      }}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            );
          }}
        </Droppable>
      </DragDropContext>


      <div className="addPeople">
      <>
      <Button onClick={showModal}>add More People</Button>
      <Modal
        title={
          <div
            style={{
              width: '100%',
              cursor: 'move',
            }}
            onMouseOver={() => {
              if (disabled) {
                setDisabled(false);
              }
            }}
            onMouseOut={() => {
              setDisabled(true);
            }}
            onFocus={() => {}}
            onBlur={() => {}}
            // end
          >
            Add Person Modal
          </div>
        }
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
        modalRender={(modal) => (
         
            <div ref={draggleRef}>{modal}</div>
       
        )}
      >
          <Space direction="vertical" size="middle">
    <Space.Compact>
      First Name:
    <Input
        style={{
          width: '70%',
        }}
        defaultValue="firstname"
        value={firstName}
        onChange={handleFirstNameChange}
      />
    </Space.Compact>
    <Space.Compact>
      Last Name:
    <Input
        style={{
          width: '70%',
        }}
        defaultValue="lastname"
        value={lastName}
        onChange={handleLastNameChange}
      />
    </Space.Compact>

    </Space>
        <br />
        <p>Day before yesterday I saw a rabbit, and yesterday a deer, and today, you.</p>
      </Modal>
    </>
      </div>
    </div>
    <div className='note'>
      YOU CAN DRAG PEOPLE BETWEEN TWO LISTS AND VICE VERSA, ALSO YOU CAN ADD MORE PEOPLE
    </div>
    </>
    );
};
export default Index;
