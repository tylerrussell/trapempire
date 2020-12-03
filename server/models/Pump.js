const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const PumpSchema = new mongoose.Schema(
	{
		uri: {
			type: String,
			required: true
		},
		username: {
			type: String,
			required: true
		}
	},
	{ timestamps: true }
);
PumpSchema.plugin(mongoosePaginate);
PumpSchema.pre("save", function(next) {
	var self = this;

	Pump.findOne({ uri: this.uri, username: this.username }, function(err, docs) {
		if (err) {
			next(err);
		} else if (docs) {
			console.warn("docs", docs);
			self.invalidate("uri", "you already pumped this track");
			next(new Error("you already pumped this track"));
		} else {
			next();
		}
	});
});
const Pump = mongoose.model("Pump", PumpSchema);

module.exports = Pump;
