using System.Collections;
using UnityEngine;

public class GridSequence : MonoBehaviour
{
    void Update()
    {
        if (Input.GetKeyDown(KeyCode.Alpha2))
        {
            ToggleGridSequence(0.03f);
        }

        if (Input.GetKeyDown(KeyCode.Alpha9))
        {
            ToggleGridPath();

        }
    }

    void ToggleGridPath()
    {
        foreach (SpriteRenderer sprite in GetComponentsInChildren<SpriteRenderer>())
        {
            sprite.enabled = !sprite.enabled;
        }
    }

    void ToggleGridSequence(float speed = 0.03f)
    {
        StartCoroutine(CounterCoroutine(speed));
    }

    private IEnumerator CounterCoroutine(float timeDelay)
    {
        SpriteRenderer[] sprite = GetComponentsInChildren<SpriteRenderer>();
        int pathSize = GetComponentsInChildren<SpriteRenderer>().Length;
        int index = 0;
        for (int i = 0; i < pathSize / 3; i++)
        {
            if (index < 3)
            {
                sprite[index].enabled = true;
                yield return new WaitForSeconds(timeDelay);
                sprite[index + 1].enabled = true;
                yield return new WaitForSeconds(timeDelay);
                sprite[index + 2].enabled = true;
                yield return new WaitForSeconds(timeDelay);
            }
            if (index < 45)
            {
                sprite[index + 3].enabled = true;
                sprite[index].enabled = false;
                yield return new WaitForSeconds(timeDelay);
                sprite[index + 4].enabled = true;
                sprite[index + 1].enabled = false;
                yield return new WaitForSeconds(timeDelay);
                sprite[index + 5].enabled = true;
                sprite[index + 2].enabled = false;
                yield return new WaitForSeconds(timeDelay);
            }

            if (index > 47)
            {
                sprite[index - 3].enabled = false;
                sprite[index].enabled = true;
                yield return new WaitForSeconds(timeDelay);
                sprite[index - 2].enabled = false;
                sprite[index + 1].enabled = true;
                yield return new WaitForSeconds(timeDelay);
                sprite[index - 1].enabled = false;
                sprite[index + 2].enabled = true;
                yield return new WaitForSeconds(timeDelay);

                sprite[index].enabled = false;
                yield return new WaitForSeconds(timeDelay);
                sprite[index + 1].enabled = false;
                yield return new WaitForSeconds(timeDelay);
                sprite[index + 2].enabled = false;
                yield return new WaitForSeconds(timeDelay);
            }
            index += 3;
        }
    }

    //private IEnumerator CounterCoroutine(float timeDelay)
    //{
    //    foreach (SpriteRenderer sprite in GetComponentsInChildren<SpriteRenderer>())
    //    {
    //        sprite.enabled = !sprite.enabled;
    //        yield return new WaitForSeconds(timeDelay);
    //    }
    //}
}
