local base = require("game.state.state_base")

local CORE_PROXY = "/state_loader#core_proxy"

local M = setmetatable({}, { __index = base })

function M.enter()
	msg.post(CORE_PROXY, "load")
	msg.post(CORE_PROXY, "enable")
end

function M.exit()
	msg.post(CORE_PROXY, "unload")
end

return M
