const bcrypt = require('bcrypt')

const run = async () => {
  const salt = await bcrypt.genSalt(10)
  const password = await bcrypt.hash('12345', salt)
  console.log(salt)
  console.log(password)
}
run()
