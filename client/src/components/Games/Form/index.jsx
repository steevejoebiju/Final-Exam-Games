import React, { useContext, useState, useEffect } from 'react';
import { NotificationContext } from '../../shared/Notifications';
import Axios from 'axios';
import { GlobalStoreContext } from '../../shared/Globals';
import { Redirect } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';

const GameForm = ({ endpoint, preload }) => {
  const [inputs, setInputs] = useState({});
  const [redirect, setRedirect] = useState(false);
  const { setNotification } = useContext(NotificationContext);
  const { globalStore } = useContext(GlobalStoreContext);

  useEffect(() => {
    setInputs({...preload});
  }, [preload])

  const handleChange = event => {
    event.persist();
    setInputs({
      ...inputs,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = event => {
    event.preventDefault();

    Axios.post(`${globalStore.REACT_APP_ENDPOINT}/${endpoint}`, {
      ...inputs})
      .then(({ data }) => {
        if (data){
          setNotification({
            type: "success",
            message: "Game was updated successfully"
          });
        }

        setRedirect(true);
      })
      .catch((error) => {
        setNotification({
          type: "danger",
          message: `There was an error updating the game: ${error.message}`
        });
      });

  };

  if (redirect) return <Redirect to="/"/>;
  return (
    <Form onSubmit={handleSubmit}>
      <Form.Label>Title</Form.Label>

      <Form.Group>
        <Form.Control 
          onChange={handleChange} 
          name="title" 
          placeholder="Cyberpunk 2077"
          defaultValue={inputs.title}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Publisher</Form.Label>

        <Form.Control 
          onChange={handleChange} 
          name="publisher" 
          placeholder="Projekt Red"
          defaultValue={inputs.publisher}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Rating</Form.Label>

        <Form.Control
          type="number" 
          onChange={handleChange} 
          name="rating" 
          defaultValue={inputs.rating}
          min={1}
          max={5}
          step={1}
        />
      </Form.Group>

      <Form.Group>
        <Button type="submit">Submit</Button>
      </Form.Group>
    </Form>
  );
}
 
export default GameForm;