// import React, { useState } from 'react';
// import {
//   Modal,
//   ModalContent,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
//   Button,
//   Textarea,
// } from '@heroui/react';

// export default function FormulaModal({ insertFormulaAtCursor }) {
//   const [isModalOpen, setModalOpen] = useState(false);
//   const [formulaInput, setFormulaInput] = useState('');

//   return (
//     <>
//       <Button onPress={() => setModalOpen(true)}>Σ Chèn công thức</Button>
//       <Modal
//         isOpen={isModalOpen}
//         onOpenChange={setModalOpen}
//       >
//         <ModalContent>
//           {(onClose) => (
//             <>
//               <ModalHeader>Soạn thảo công thức</ModalHeader>
//               <ModalBody>
//                 <Textarea
//                   placeholder='Nhập công thức LaTeX hoặc text'
//                   value={formulaInput}
//                   onValueChange={setFormulaInput}
//                 />
//               </ModalBody>
//               <ModalFooter>
//                 <Button
//                   color='primary'
//                   onPress={() => {
//                     insertFormulaAtCursor(formulaInput);
//                     setModalOpen(false);
//                     setFormulaInput('');
//                   }}
//                 >
//                   Chèn
//                 </Button>
//                 <Button
//                   variant='light'
//                   onPress={onClose}
//                 >
//                   Hủy
//                 </Button>
//               </ModalFooter>
//             </>
//           )}
//         </ModalContent>
//       </Modal>
//     </>
//   );
// }
