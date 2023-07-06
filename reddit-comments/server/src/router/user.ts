import { Router, Request, Response } from "express"

const router = Router()

router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params
  return res.send(`this is user ${id}`)
})

export default router