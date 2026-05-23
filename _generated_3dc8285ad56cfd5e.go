embedded_components {
  id: "model"
  type: "model"
  data: "mesh: \"/builtins/assets/meshes/quad.dae\"\nname: \"{{NAME}}\"\nmaterials {\n  name: \"default\"\n  material: \"/materials/outline/outline_final.material\"\n  textures {\n    sampler: \"texture_sampler\"\n    texture: \"/materials/outline/outline.render_target\"\n  }\n  textures {\n    sampler: \"mask_sampler\"\n    texture: \"/assets/atlases/level1/mask_on_safe.png\"\n  }\n}\n"
}
