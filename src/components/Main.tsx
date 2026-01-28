import React, { useState } from 'react';
import BorderTitle from './SVG/BorderTitle';
import CirclePoints from './MainPage/CirclePoints';
import { events } from '../utils/consts';
import SwiperDatesList from './MainPage/SwiperDatesList';
import Panel from './MainPage/Panel';
import CountYear from './MainPage/CountYear';
import MobTitle from './MainPage/MobTitle';

const Main: React.FC = () => {
  const [activeCategoryId, setActiveCategoryId] = useState<number>(0);

  return (
    <main className='main'>
      <div className='main__header'>
        <span className='main__title-decor'>
          <BorderTitle />
        </span>
        <h1 className='main__title'>
          Исторические <br />
          даты
        </h1>
      </div>

      <div className='main__center'>
        <div className='main__decor main__decor--hor'></div>
        <div className='main__decor main__decor--ver'></div>
        <div className='main__dates'>
          <span className='main__date main__date--low'>
            <CountYear value={events[activeCategoryId].start} />
          </span>
          <span className='main__date main__date--high'>
            <CountYear value={events[activeCategoryId].end} />
          </span>
        </div>

        <div className='main__circle'>
          <CirclePoints
            activeCategoryId={activeCategoryId}
            onChangeCategory={setActiveCategoryId}
            points={events}
            title={events[activeCategoryId].title}
          />
        </div>
      </div>

      <div className='main__footer'>
        <Panel
          activeCategoryId={activeCategoryId}
          onChangeCategory={setActiveCategoryId}
          events={events}
        />
        <MobTitle title={events[activeCategoryId].title} />
        <SwiperDatesList activeCategoryId={activeCategoryId} events={events} />
      </div>
    </main>
  );
};

export default Main;
