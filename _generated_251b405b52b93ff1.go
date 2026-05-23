components {
  id: "controller"
  component: "/scripts/controller.script"
  properties {
    id: "Controller"
    value: "CoreController"
    type: PROPERTY_TYPE_HASH
  }
}
embedded_components {
  id: "level_factory"
  type: "collectionfactory"
  data: "prototype: \"/main/core/level.collection\"\n"
}
