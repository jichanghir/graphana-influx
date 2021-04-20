const Influx = require('influx');

const influx = new Influx.InfluxDB({
  host: 'localhost',
  database: 'test',
  port: 8086,
  username: 'user',
  password: 'password',
  schema: [
    {
      measurement: 'response_times',
      fields: {
        path: Influx.FieldType.STRING,
        duration: Influx.FieldType.INTEGER
      },
      tags: [
        'host'
      ]
    }
  ]
});

influx.writePoints([
  {
    measurement: 'response_times',
    tags: { host: 'test_host' },
    fields: { duration: Math.random(), path: 'asd' },
  }
]).then(() => {
  return influx.query(`
    select * from response_times
    where host = ${Influx.escape.stringLit('test_host')}
    order by time desc
    limit 10
  `)
}).then(rows => {
  rows.forEach(row => console.log(`A request to ${row.path} took ${row.duration}ms`))
})
