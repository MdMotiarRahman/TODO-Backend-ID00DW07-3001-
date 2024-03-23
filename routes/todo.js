const express = require('express');
const { pool } = require('../helpers/db.js'); // for connecting to Postgres

const todoRouter = express.Router()


// Route to retrieve all tasks
todoRouter.get('/', async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM task');
      const tasks = result.rows;
      client.release();
      res.json(tasks);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });
  
// Route to save a new task
todoRouter.post('/new', async (req, res) => {
      const { description } = req.body;
    
      if (!description) {
        return res.status(400).json({ message: 'Description is required' });
      }
    
      try {
        const client = await pool.connect();
        const result = await client.query('INSERT INTO task (description) VALUES ($1) RETURNING id', [description]);
        const newTask = result.rows[0];
        client.release();
        res.status(200).json({ id: newTask.id });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message});
      }
    });
  
// Route to delete a task by ID
todoRouter.delete('/delete/:id', async (req, res) => {
    const { id } = req.params; // assuming ID is in the URL parameter
  
    if (!id) {
      return res.status(400).json({ error: 'Task ID is required' });
    }
  
    try {
      const client = await pool.connect();
      const result = await client.query('DELETE FROM task WHERE id = $1', [id]);
      const deletedCount = result.rowCount;
      client.release();
  
      if (deletedCount === 0) {
        return res.status(404).json({ error: 'Task not found' });
      }
  
      res.status(200).json({id:id});
    } catch (error) {
      console.error(error);
      res.status(500).json({error: error.message});
    }
  });
  
  module.exports={todoRouter}