const { Pool } = require('pg');
const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

const pool = new Pool();
const app = new Koa();
const router = new Router();

app.use(bodyParser());
app.use(router.routes()).use(router.allowedMethods());

router.get('/', (ctx) => {
  ctx.body = 'From / route';
});

// Read the database to get all the values
router.get('/all-person', async (ctx) => {
  const client = await pool.connect();
  try {
    const res = await client.query('SELECT * FROM person');
    ctx.body = res.rows;
  } catch (err) {
    console.log(err);
    ctx.body = 'Something went wrong';
  } finally {
    client.release();
  }
});

router.post('/add-person', async (ctx) => {
  const client = await pool.connect();
  const name = ctx.request.body.name;
  try {
    await client.query('INSERT INTO person (name) VALUES ($1)', [name]);
  } catch (err) {
    console.log(err);
    ctx.body = 'Something went wrong: from /add-person route';
  }
});

app.listen(8080, () => {
  console.log('server started at port 8080');
});
