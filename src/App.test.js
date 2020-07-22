import React from "react";
import { render, fireEvent, within, waitForElementToBeRemoved } from "@testing-library/react";
import App from "./App";
import mockPosts from "./__mocks__/mockPosts.json";

jest.mock('./api')

const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function getPostDay({ createdAt }) {
  return new Date(createdAt).getDay();
}

test.each(weekdays)(
  "shows table containing correct posts for %s",
  async (weekday) => {
    const {
      debug, getByText, getByLabelText, getByRole, getAllByRole, getAllByText
    } = render(<App />);

    const weekdayCombo = getByLabelText(/Selected weekday/);
    fireEvent.change(weekdayCombo, { target: { value: weekday } });

    await waitForElementToBeRemoved(() => getByText(/Loading/))
    const table = getByRole("table");
    const rows = getAllByRole('row')

    const day = weekdays.indexOf(weekday);
    const postOnWeekday = mockPosts.filter((post) => getPostDay(post) === day);

    postOnWeekday.forEach((post, index) => {
      const row = rows[index + 1] // skipping header row
      within(row).getByText(post.author)
      within(row).getByText(post.title)
      within(row).getByText(post.score.toString())
    })
  }
);
