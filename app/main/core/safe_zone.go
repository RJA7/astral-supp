embedded_components {
  id: "sprite"
  type: "sprite"
  data: "default_animation: \"white_pixel\"\n"
  "material: \"/main/materials/mask/mask.material\"\n"
  "size {\n"
  "  x: 1.0\n"
  "  y: 1.0\n"
  "}\n"
  "textures {\n"
  "  sampler: \"texture_sampler\"\n"
  "  texture: \"/assets/atlases/main.atlas\"\n"
  "}\n"
  ""
  position {
    y: 0.5
  }
  rotation {
    z: 0.70710677
    w: 0.70710677
  }
}
embedded_components {
  id: "body"
  type: "collisionobject"
  data: "type: COLLISION_OBJECT_TYPE_TRIGGER\n"
  "mass: 0.0\n"
  "friction: 0.1\n"
  "restitution: 0.5\n"
  "group: \"safe_zone\"\n"
  "mask: \"player\"\n"
  "embedded_collision_shape {\n"
  "  shapes {\n"
  "    shape_type: TYPE_BOX\n"
  "    position {\n"
  "    }\n"
  "    rotation {\n"
  "    }\n"
  "    index: 0\n"
  "    count: 3\n"
  "  }\n"
  "  data: 10.0\n"
  "  data: 10.0\n"
  "  data: 10.0\n"
  "}\n"
  "event_collision: false\n"
  "event_contact: false\n"
  ""
}
