import { Vector3 } from "three"
import { ECS, Entity } from "../state"

const entities = ECS.world.archetype("transform")

export const spatialHashingSystem = () => {
  /* Bluntly clear the spatial hash every frame. TODO: optimize this */
  for (const key in cells) cells.get(key)!.length = 0

  for (const entity of entities) {
    const key = cellKey(entity.transform.position)
    if (!cells.has(key)) cells.set(key, [])
    cells.get(key)!.push(entity)
  }
}

const cells = new Map<string, Entity[]>()

export const cellKey = (p: Vector3) =>
  `${Math.floor(p.x)}|${Math.floor(p.y)}|${Math.floor(p.z)}`

export const getEntitiesInCell = (p: Vector3) => cells.get(cellKey(p)) || []

export const getEntitiesInRadius = (p: Vector3, r: number) => {
  const entities: Entity[] = []
  const x = Math.floor(p.x)
  const y = Math.floor(p.y)
  const z = Math.floor(p.z)
  for (let i = -r; i <= r; i++) {
    for (let j = -r; j <= r; j++) {
      for (let k = -r; k <= r; k++) {
        const key = `${x + i}|${y + j}|${z + k}`
        if (cells.has(key)) entities.push(...cells.get(key)!)
      }
    }
  }
  return entities
}
