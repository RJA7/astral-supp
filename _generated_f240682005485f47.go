embedded_components {
  id: "sprite"
  type: "sprite"
  data: "default_animation: \"player_red\"\nmaterial: \"/builtins/materials/sprite.material\"\nsize {\n  x: 80.0\n  y: 80.0\n}\ntextures {\n  sampler: \"texture_sampler\"\n  texture: \"/assets/atlases/main.atlas\"\n}\n"
  scale {
    x: 0.4
    y: 0.4
  }
}
embedded_components {
  id: "body"
  type: "collisionobject"
  data: "type: COLLISION_OBJECT_TYPE_TRIGGER\nmass: 0.0\nfriction: 0.1\nrestitution: 0.5\ngroup: \"player\"\nmask: \"finish_zone\"\nmask: \"bullet\"\nmask: \"pickup\"\nembedded_collision_shape {\n  shapes {\n    shape_type: TYPE_BOX\n    position {\n    }\n    rotation {\n    }\n    index: 0\n    count: 3\n    id: \"box\"\n  }\n  data: 16.0\n  data: 16.0\n  data: 10.0\n}\nevent_collision: false\nevent_contact: false\n"
}
