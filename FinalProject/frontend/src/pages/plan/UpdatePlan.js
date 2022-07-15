import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { NumPlaceItem } from '.';
import { format, addDays } from 'date-fns';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { saveTrip, savePlan } from '../../modules/planner';

const { kakao } = window;

const UpdatePlan = () => {
  // redux에서 변수 얻기
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const {tripNum} = useParams();

  const [tripInfo, setTripInfo] = useState({
    startDate: format(new Date(), "yyyy-MM-dd"),
    endDate: format(new Date(), "yyyy-MM-dd")
  });

  const [plan, setPlan] = useState([]);

  const [focus, setFocus] = useState(0);

  let tripUrl = `${process.env.REACT_APP_SPRING_URL}plan/info?tripNum=`

  const getTripInfo = () => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('jwtToken')}`;
    axios.get(tripUrl + tripNum)
    .then(res => {
      console.log(res.data);
      setTripInfo(res.data);
      // setPlan(Array.from(Array(res.data.days), () => new Array()));
      dispatch(saveTrip(res.data));
      // dispatch(setPlan(Array.from(Array(res.data.days), () => new Array())));
      // console.log(plan);
    })
    .catch(err => {
      console.log(err);
    });
  };

  // 도시 정보, 일정 가저오기
  useEffect(() => {
    getTripInfo();
  }, []);

  const updatePlan = () => {

  }

  // kakao map
  const kakaoMapScript = () => {
    console.log("map");
    const container = document.getElementById('map'); // 지도를 표시할 div  

    const options = {
      center: new kakao.maps.LatLng(tripInfo.y, tripInfo.x), // 지도의 중심좌표
      level: 9  // 지도의 확대 레벨
    };
    
    const map = new kakao.maps.Map(container, options); // 지도를 생성합니다

    // 일정에 있는 장소 마커들
    let markerList = [];

    for(let i in plan[focus]){
      markerList.push({latlng: new kakao.maps.LatLng(plan[focus][i].mapy, plan[focus][i].mapx), title: plan[focus][i].title});
    }

    // 커스텀 오버레이
    for (let i in markerList) {
      // 커스텀 오버레이에 표시할 내용
      // HTML 문자열 또는 Dom Element
      let content = `<div class ="label">${Number(i) + 1}</div>`;

      // 커스텀 오버레이가 표시될 위치
      let position = markerList[i].latlng;

      // 커스텀 오버레이를 생성
      let customOverlay = new kakao.maps.CustomOverlay({
        position: markerList[i].latlng,
        content: content
      });

      // 커스텀 오버레이를 지도에 표시
      customOverlay.setMap(map);
    }

    // 마커와 마커 사이에 선 그리기
    // 선을 구성하는 좌표 배열
    let linePath = [];

    for(let j in plan[focus]){
      linePath.push(new kakao.maps.LatLng(plan[focus][j].mapy, plan[focus][j].mapx));
    }

    // 지도에 표시할 선을 생성
    let polyline = new kakao.maps.Polyline({
      path: linePath, // 선을 구성하는 좌표 배열
      strokeWeight: 2.5, // 선의 두께
      strokeColor: '#333333', // 선의 색깔
      strokeOpacity: 0.6, // 선의 불투명도: 1에서 0 사이의 값, 0에 가까울수록 투명
      strokeStyle: 'shortdash' // 선의 스타일
    });

    // 지도에 선을 표시
    polyline.setMap(map);

    // 지도 범위 재설정
    if(linePath.length !== 0){  // 좌표 없이 범위 재설정 시 지도가 안 뜸
      // 지도를 재설정할 범위정보를 가지고 있을 LatLngBounds 객체를 생성
      var bounds = new kakao.maps.LatLngBounds();

      for (let k in linePath) {
        bounds.extend(linePath[k]); // LatLngBounds 객체에 좌표를 추가
      }

      map.setBounds(bounds, 100, 100, 100, 450);
      // map.setBounds(bounds);
    }
  };

  useEffect(() => {
    kakaoMapScript();
  }, [focus, tripInfo]);

  return (
    <div id='plan-update'>
      <div id='map'></div>

      <div className='box-wrap'>
        <div className='title'>{tripInfo.cityName} 여행</div>
        {
          tripInfo.days == 1 ? <div className='period'>{tripInfo.startDate} ({tripInfo.days}일)</div> : <div className='period'>{tripInfo.startDate} ~ {tripInfo.endDate} ({tripInfo.days}일)</div>
        }

        {/* {
          days == 1 ? <div className='period'>{new Date(tripInfo.startDate).toDateString} ({tripInfo.days}일)</div> : <div className='period'>{new Date(tripInfo.startDate).toDateString} ~ {new Date(tripInfo.endDate).toDateString} ({tripInfo.days}일)</div>
        } */}

        <button type='button' className='btn btn-primary btn-sm btn-plan' onClick={updatePlan}>수정 완료</button>
        {
          // days 만큼 반복문 돌리기
          [...Array(tripInfo.days)].map((day, index) => (
            <div key={index + 1} className='day'>
              <span className='title' onClick={() => {
                setFocus(index);
              }}>Day {index + 1}</span>
              {/* <span>{format(addDays(new Date(tripInfo.startDate), index), "yyyy-MM-dd")}</span> */}
              <div className='day-place-list'>
                {
                  plan[index] && plan[index].map((place, i) => (
                    <div className='place-list-item' key={i}>
                      <NumPlaceItem place={place} num={i + 1} focus={focus === (index) ? true : false}/>
                    </div>
                  ))
                }
              </div>
              <button type='button' className='btn btn-outline-primary btn-sm btn-place' onClick={() => {
                navigate(`/plan/${index + 1}`);
              }}>장소 추가</button>
              <button type='button' className='btn btn-outline-secondary btn-sm btn-memo'>메모 추가</button>
            </div>
          ))
        }
      </div>

    </div>
  );
};

export default UpdatePlan;