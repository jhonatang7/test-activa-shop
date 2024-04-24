import React from 'react';

export default function StatusResponse({
  statusResponse,
}: {
  statusResponse: string;
}) {
  const Status = {
    'En Proceso': 'En Proceso',
    Resuelto: 'Resuelto',
    Fallido: 'Fallido',
  };

  const divStyle = 'grid place-content-center w-full rounded-lg my-2';
  const textStyle = 'font-bold text-neutral-700';

  switch (statusResponse) {
    case Status['En Proceso']:
      return (
        <div className={`${divStyle} bg-stone-300`}>
          <span className={textStyle}>{statusResponse}</span>
        </div>
      );
    case Status['Fallido']:
      return (
        <div className={`${divStyle} bg-red-500`}>
          <span className={textStyle}>{statusResponse}</span>
        </div>
      );
    case Status['Resuelto']:
      return (
        <div className={`${divStyle} bg-green-500`}>
          <span className={textStyle}>{statusResponse}</span>
        </div>
      );
    default:
      return (
        <div className={`${divStyle} bg-stone-300`}>
          <span className={textStyle}>{statusResponse}</span>
        </div>
      );
  }
}
