import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

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

    //있는지 확인 후 저장 직전에 암호화 넣어야지!
    //패스워드 암호화 (마지막에 구현)
    const hashedPassword = bcrypt.hashSync(password, 10); // 이렇게 하면 암호화된다.
    // bcrypt.compare 복구

    //데이터베이스 저장 (유저 생성)
    const newUser = await client.user.create({
      data: {
        account, //(생략 문법)
        password: hashedPassword, //(생략 문법)
      },
      select: {
        // 보여줄 애만 트루
        id: true,
        createdAt: true,
        updatedAt: true,
        account: true,
      },
    });

    // console.log(newUser);

    //사용자에게 응답: 이 녀석은 생성 api이기 때문에 방금 생성된 애 응답해주면 좋을 것
    return NextResponse.json(newUser); //응답 1, 주로 이거 사용. 얜 바로 넣어줌 얜 엑시오스로 가져올 때 response.data 에 바로 존재
    /*
    return NextResponse.json({
      // 응답2: 데이터 한 번 더 감싸줌, 여러 데이터 응답해줘야 할 때 유용. // 앤 axios 로 가져올 때 response.data.user에 존재
      user: newUser,
    });
    */
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
