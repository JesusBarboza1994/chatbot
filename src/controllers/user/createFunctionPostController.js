import createFunction from "../../services/createFunction.js"

export default async function createFunctionPostController(req, res) {
  try {
   const {name, description, properties, required, store} = req.body
   const response = await createFunction({name, description, properties, required, store})
   return res.status(200).send(response)
  } catch (error) {
    console.log(error)
    return res.status(500).send({message: error.message})
  }
  
}