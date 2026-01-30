local M = {}

local states = {}
local current = nil

function M.init()
	states.menu = require("game.state.states.state_menu")
	states.core = require("game.state.states.state_core")
end

function M.switch(id)
	if current then
		current.exit()
	end

	current = states[id]
	current.enter()
end

function M.update(dt)
	if current then
		current.update(dt)
	end
end

function M.on_message(message_id, message, sender)
	if current then
		current.on_message(message_id, message, sender)
	end
end

return M
