import comments from './new-comments.js';

// import fs from 'fs';

// let i = 0;
// const filteredComments = comments.filter((review, index) => {
//   const length = review.comments.length;
//   if (length === null || length === 0) {
//     console.log(length, index);
//     i++;
//   } else {
//     return review;
//   }
// });
// let filteredComments = [];

// for (let i = 0; i < comments.length; i++) {
//   if (comments[i].comments.length >= 10) {
//     filteredComments.push(comments[i]);
//   }
// }
// console.log(i);
console.log(comments.length);
// console.log(filteredComments.length);

// const newComments = comments.map((comment) => {
//   i++;
//   return {
//     ...comment,
//     id: i,
//   };
// });

// fs.writeFileSync('new-comments.js', JSON.stringify(filteredComments), (err) => {
//   if (err) console.log(err);
//   else console.log('file saved');
// });

// console.log(newComments.length);

// console.log(comments.length);
// console.log(filteredComments.length);
