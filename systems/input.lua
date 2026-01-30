local utils_table = require("utils.table")

local M = {}

M.listeners = {}

function M.register(listener)
    if not utils_table.find(M.listeners, listener) then
        table.insert(M.listeners, listener)
    end
end

function M.unregister(listener)
    utils_table.remove_value(M.listeners, listener);
end

function M.dispatch(action_id, action)
    for _, listener in ipairs(M.listeners) do
        msg.post(listener, 'input', { action_id = action_id, action = action })
    end
end

function M.on_input(action_id, action)
    if action_id == hash("touch") or action_id == hash("mouse_button_1") or action_id == hash("mouse_move") then
        M.dispatch(action_id, action)
    end
end

return M
