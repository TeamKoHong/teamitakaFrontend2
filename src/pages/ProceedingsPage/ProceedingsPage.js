import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DefaultHeader from "../../components/Common/DefaultHeader";
import addNoteIcon from "../../assets/icons/add_note.png";
import userDefaultImg from "../../assets/icons/user_default_img.svg";
import "./ProceedingPage.scss";

export default function ProceedingsPage() {
  const navigate = useNavigate();
  const { id: projectId } = useParams();
  const [meetingData, setMeetingData] = useState([]);
  
  const handleCreateMeeting = () => {
    navigate(`/project/${projectId}/proceedings/create`);
  };

  // 기본 회의록 데이터
  const defaultMeetingData = useMemo(() => [
    {
      month: "04월",
      meetings: [
        {
          day: "15일",
          entries: [
            {
              id: 1,
              title: "중간 발표 단체 연습 및 준비",
              author: "작성자 닉네임",
              description: "회의에 대한 간단 메모"
            }
          ]
        },
        {
          day: "05일",
          entries: [
            {
              id: 2,
              title: "추가 회의 및 자료정리 완료 확인",
              author: "작성자 닉네임",
              description: "회의에 대한 간단 메모"
            }
          ]
        },
        {
          day: "02일",
          entries: [
            {
              id: 3,
              title: "아이데이션을 위한 전체 회의",
              author: "작성자 닉네임",
              description: "회의에 대한 간단 메모"
            },
            {
              id: 4,
              title: "아이데이션을 위한 전체 회의",
              author: "작성자 닉네임",
              description: "수정은 프로젝트 진행 기간 동안 항상 가능하지만, 프로젝트 종료되면 수정 불가능"
            }
          ]
        }
      ]
    },
    {
      month: "03월",
      meetings: [
        {
          day: "15일",
          entries: [
            {
              id: 5,
              title: "중간 발표 단체 연습",
              author: "작성자 닉네임",
              description: "회의에 대한 간단 메모"
            }
          ]
        },
        {
          day: "05일",
          entries: [
            {
              id: 6,
              title: "추가 회의 및 자료정리 완료 확인",
              author: "작성자 닉네임",
              description: "회의에 대한 간단 메모"
            }
          ]
        },
        {
          day: "02일",
          entries: [
            {
              id: 7,
              title: "아이데이션을 위한 전체 회의",
              author: "작성자 닉네임",
              description: "회의에 대한 간단 메모"
            }
          ]
        }
      ]
    }
  ], []);

  // 회의록 데이터를 가져오고 오늘 날짜 회의록을 추가하는 함수
  const loadMeetingData = useCallback(() => {
    const savedMeetings = JSON.parse(localStorage.getItem('meetings') || '[]');
    const today = new Date();
    const currentMonth = String(today.getMonth() + 1).padStart(2, '0');
    const currentDay = String(today.getDate()).padStart(2, '0');
    
    // 기본 데이터 복사
    let updatedData = JSON.parse(JSON.stringify(defaultMeetingData));
    
    // 저장된 회의록들을 날짜별로 그룹화
    const meetingsByDate = {};
    savedMeetings.forEach(meeting => {
      const meetingDate = new Date(meeting.createdAt);
      const month = String(meetingDate.getMonth() + 1).padStart(2, '0');
      const day = String(meetingDate.getDate()).padStart(2, '0');
      const dateKey = `${month}월_${day}일`;
      
      if (!meetingsByDate[dateKey]) {
        meetingsByDate[dateKey] = {
          month: `${month}월`,
          day: `${day}일`,
          entries: []
        };
      }
      meetingsByDate[dateKey].entries.push(meeting);
    });
    
    // 오늘 날짜가 있는지 확인하고 추가
    const todayKey = `${currentMonth}월_${currentDay}일`;
    if (meetingsByDate[todayKey]) {
      // 오늘 날짜 데이터가 있는 경우, 해당 월에 추가
      const monthIndex = updatedData.findIndex(month => month.month === `${currentMonth}월`);
      if (monthIndex !== -1) {
        // 해당 월에 오늘 날짜가 이미 있는지 확인
        const dayIndex = updatedData[monthIndex].meetings.findIndex(day => day.day === `${currentDay}일`);
        if (dayIndex !== -1) {
          // 기존 오늘 날짜에 회의록 추가
          updatedData[monthIndex].meetings[dayIndex].entries = [
            ...updatedData[monthIndex].meetings[dayIndex].entries,
            ...meetingsByDate[todayKey].entries
          ];
        } else {
          // 새로운 오늘 날짜 추가
          updatedData[monthIndex].meetings.push(meetingsByDate[todayKey]);
        }
      } else {
        // 새로운 월 추가
        updatedData.unshift({
          month: `${currentMonth}월`,
          meetings: [meetingsByDate[todayKey]]
        });
      }
    }
    
    // 날짜별로 정렬
    updatedData.forEach(monthData => {
      monthData.meetings.sort((a, b) => {
        const dayA = parseInt(a.day);
        const dayB = parseInt(b.day);
        return dayB - dayA; // 최신 날짜가 위로
      });
    });
    
    // 월별로 정렬 (최신 월이 위로)
    updatedData.sort((a, b) => {
      const monthA = parseInt(a.month);
      const monthB = parseInt(b.month);
      return monthB - monthA;
    });
    
    setMeetingData(updatedData);
  }, [defaultMeetingData]);

  useEffect(() => {
    loadMeetingData();
  }, [loadMeetingData]);

  // 페이지 포커스 시 데이터 새로고침 (새 회의록 생성 후 돌아올 때)
  useEffect(() => {
    const handleFocus = () => {
      loadMeetingData();
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [loadMeetingData]);

  return (
    <div className="proceedings-page-container">
      <DefaultHeader title="팀 회의록" showChat={false} backPath={`/project/${projectId}`} />
      
      <div className="proceedings-content">
        {meetingData.map((monthData, monthIndex) => (
          <div key={monthData.month} className="month-section">
            <h2 className="month-header">{monthData.month}</h2>
            
            {monthData.meetings.map((dayData, dayIndex) => (
              <div key={dayData.day} className="day-group">
                <span className="day-label">{dayData.day}</span>
                <div className="meeting-cards">
                  {dayData.entries.map((meeting) => (
                    <div key={meeting.id} className="meeting-card">
                      <h3 className="meeting-title">{meeting.title}</h3>
                      <div className="meeting-author">
                        <img src={userDefaultImg} alt="사용자 아바타" />
                        <span>{meeting.author}</span>
                      </div>
                      <p className="meeting-description">{meeting.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            {monthIndex < meetingData.length - 1 && (
              <div className="month-divider"></div>
            )}
          </div>
        ))}
      </div>

      {/* 플로팅 액션 버튼 */}
      <button className="floating-action-btn" onClick={handleCreateMeeting}>
        <img src={addNoteIcon} alt="회의록 추가" />
      </button>
    </div>
  );
}
