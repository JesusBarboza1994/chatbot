import createUser from '../../services/createUser.js'
export default async function createUserPostController(req, res) {
  try {
    const {store, phone_number, email, password, prompt} = req.body
    const response = await createUser({store: store.trim(), phone_number, email: email.trim(), password, prompt})
    return res.status(200).send({message: "User created", data: response})
  } catch (error) {
    console.log(error)
    return res.status(500).send({message: error.message})
  }
  
}