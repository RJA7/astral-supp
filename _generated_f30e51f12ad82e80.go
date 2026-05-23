components {
  id: "controller"
  component: "/scripts/controller.script"
  properties {
    id: "Controller"
    value: "MainController"
    type: PROPERTY_TYPE_HASH
  }
}
embedded_components {
  id: "proxy_core"
  type: "collectionproxy"
  data: "collection: \"/main/core/core.collection\"\n"
}
