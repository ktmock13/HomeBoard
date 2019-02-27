// The User schema.
import FinEvent from "../../../models/FinEvents";

export default {
    Query: {
        finEvent: (root, args) => {
            return new Promise((resolve, reject) => {
                FinEvent.findOne(args).exec((err, res) => {
                    err ? reject(err) : resolve(res);
                });
            });
        },
        finEvents: () => {
            return new Promise((resolve, reject) => {
                FinEvent.find({})
                    .populate()
                    .exec((err, res) => {
                        err ? reject(err) : resolve(res);
                    });
            });
        }
    },
    Mutation: {
        addFinEvent: (root, { id, datetime, amount, desc }) => {
            const newFinEvent = new FinEvent({ id, datetime, amount, desc });

            return new Promise((resolve, reject) => {
                newFinEvent.save((err, res) => {
                    err ? reject(err) : resolve(res);
                });
            });
        },
        editFinEvent: (root, { id ,datetime, amount, desc }) => {
            return new Promise((resolve, reject) => {
                FinEvent.findOneAndUpdate({ id }, { $set: { datetime, amount, desc } }).exec(
                    (err, res) => {
                        err ? reject(err) : resolve(res);
                    }
                );
            });
        },
        deleteFinEvent: (root, args) => {
            return new Promise((resolve, reject) => {
                FinEvent.findOneAndRemove(args).exec((err, res) => {
                    err ? reject(err) : resolve(res);
                });
            });
        }
    }
};