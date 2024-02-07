import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

//유저 생성 api 요청 만들기

//api 요청은 리퀘스트는 없어도 되는데 리스폰스는 반드시 하나 있어야 한다!
export const POST = async (request: NextRequest) => {
  //request  작성은 필히 해주는데 경우에 따라 안 쓰일 수도 있음
  // 비동기 함수니까

  try {
    const { account, password } = await request.json(); //비동기로 꺼내옴. 각각을 구조분해로 꺼내옴. json이라는 함수 실행시키는 거.바디에서 가져옴

    console.log(account);
    console.log(password);

    //잘 받았는지 확인 없으면 에러
    if (!account || !password) {
      return NextResponse.json(
        {
          message: "Not exist data",
        },
        {
          status: 400,
        }
      );
    }

    // account 중복 확인 중복시 에러: 디비 연결 필요하네 -> prisma 들어온다!
    const existUser = await client.user.findUnique({
      //find는 무엇을 기준으로 찾을지 등 조건 여기에 넣어줘야 함
      where: {
        account, //(생략 문법 account: account)
      },
    }); //prisma push하면 .했을 때 user 자동완성됨

    console.log(existUser);

    if (existUser) {
      //유저 생성해야 하는데, 있다는 의미가 돼서 에러임
      return NextResponse.json(
        {
          message: "Already exist user",
        },
        {
          status: 400,
        }
      );
    }

    const newUser = await client.user.create({
      data: {
        account, //(생략 문법)
        password, //(생략 문법)
      },
    });

    console.log(newUser);

    return NextResponse.json({
      message: "ok",
    });

    //패스워드 암호화 (마지막에 구현)
    //데이터베이스 저장 (유저 생성)
    //사용자에게 응답
  } catch (error) {
    console.log(error); //콘솔은 개발자가 볼 수 있는 곳

    return NextResponse.json(
      {
        message: "Server Error", //error: error 혹은 error(얘는 키밸류 같은 경우) 도 됨 // 메시지는 사용자 볼 수 있게
      },
      {
        status: 500,
      }
    );
  }
};
