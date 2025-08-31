import { z } from "zod";

export const CellValueSchema = z.union([
	z.literal(0),
	z.literal(-1),
	z.literal(1),
]);
export const RowSchema = z.array(CellValueSchema).length(3);
export const BoardSchema = z.array(RowSchema).length(3);
export const PlayerSchema = z.enum(["X", "O"]);

export const MakeMoveRequestSchema = z.object({
	state: BoardSchema,
	current_player: PlayerSchema,
});

export const GameStatusRequestSchema = z.object({
	state: BoardSchema,
});
