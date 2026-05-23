embedded_components {
  id: "body"
  type: "collisionobject"
  data: "type: COLLISION_OBJECT_TYPE_TRIGGER\nmass: 0.0\nfriction: 0.1\nrestitution: 0.5\ngroup: \"player_trigger\"\nmask: \"safe_zone\"\nmask: \"finish_zone\"\nembedded_collision_shape {\n  shapes {\n    shape_type: TYPE_BOX\n    position {\n    }\n    rotation {\n    }\n    index: 0\n    count: 3\n    id: \"shape\"\n  }\n  data: 0.5\n  data: 0.5\n  data: 10.0\n}\nevent_collision: false\nevent_contact: false\n"
}
