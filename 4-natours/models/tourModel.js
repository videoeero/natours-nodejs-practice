const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      // eslint-disable-next-line prettier/prettier
      required: [ true, 'A tour must have a name' ],
      unique: true,
      trim: true,
      maxlength: [ 40, 'A tour must have less or equal than 40 characters' ],
      minlength: [ 5, 'A tour must have more or equal than 5 characters' ]
      // validate: [ validator.isAlpha, 'Tour name must only contain characters' ]
    },
    slug: String,
    duration: {
      type: Number,
      required: [ true, 'A tour must have a duration' ]
    },
    maxGroupSize: {
      type: Number,
      required: [ true, 'A tour must have a group size' ]
    },
    difficulty: {
      type: String,
      required: [ true, 'A tour must have a difficulty' ],
      enum: {
        values: [ 'easy', 'medium', 'difficult' ],
        message: 'Difficulty is either: easy, medium, difficult'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [ 1, 'Rating must be above 1.0' ],
      max: [ 5, 'Rating must be below 5.0' ]
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      // eslint-disable-next-line prettier/prettier
      required: [ true, 'A tour must have a price' ]
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function(val) {
          // NOTE: this only points to current doc on NEW document creation
          return val < this.price;
        },
        message: 'Discount price {VALUE} cannot be higher than regular price!'
      }
    },
    summary: {
      type: String,
      trim: true,
      required: [ true, 'A tour must have a description' ]
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [ true, 'A tour must have a cover image' ]
    },
    images: [ String ],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    startDates: [ Date ],
    secretTour: {
      type: Boolean,
      default: false
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
});

// NOTE: DOCUMENT MIDDLEWARE: runs before .save() and .create()
tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre('save', function(next) {
//   console.log('will save doc');
//   next();
// });

// tourSchema.post('save', function(doc, next) {
//   console.log(doc);
//   next();
// });

// NOTE: QUERY MIDDLEWARE
// Reg exp for every query with 'find'
tourSchema.pre(/^find/, function(next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function(docs, next) {
  console.log(docs);
  console.log(`Query took ${Date.now() - this.start} ms`);
  next();
});

// NOTE: Aggreagation middleware

tourSchema.pre('aggregate', function(next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
